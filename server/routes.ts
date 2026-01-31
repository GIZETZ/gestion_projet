import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { Server as SocketIOServer } from "socket.io";
import PDFDocument from "pdfkit";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express,
  io: SocketIOServer
): Promise<Server> {
  
  // Auth Middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  // Types for session - using augmentation in a module can be tricky with some bundlers
  // so we will just use type assertion or basic usage
  
  // Middleware to check if authenticated
  const isAuthenticated = (req: any, res: any, next: any) => {
    if ((req.session as any).userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Middleware to check if admin
  const isAdmin = async (req: any, res: any, next: any) => {
    const session = req.session as any;
    if (!session.userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await storage.getUser(session.userId);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };

  // Seed topics on startup
  await storage.seedTopics();

  // Socket.io setup - handle real-time game events
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.username);
      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if this is the first user ever
      const allUsers = await storage.listUsers();
      const isFirstUser = allUsers.length === 0;

      const user = await storage.createUser({
        ...input,
        groupMembers: input.groupMembers || "",
      }); 
      
      // If schema doesn't allow passing isAdmin in createUser (it's defaulted in DB), we update it.
      if (isFirstUser) {
        await db.update(users).set({ isAdmin: true, isApproved: true }).where(eq(users.id, user.id));
        user.isAdmin = true;
        user.isApproved = true;
      }

      (req.session as any).userId = user.id;
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByUsername(input.username);
      
      if (!user || user.password !== input.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).userId = user.id;
      res.json(user);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, async (req, res) => {
    const session = req.session as any;
    if (!session.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await storage.getUser(session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(user);
  });

  // Topics Routes
  app.get(api.topics.list.path, async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  });

  app.post(api.topics.choose.path, isAuthenticated, async (req, res) => {
    const session = req.session as any;
    const user = await storage.getUser(session.userId!);
    if (!user || !user.isApproved) {
      return res.status(403).json({ message: "You are not approved yet." });
    }

    const topicId = Number(req.params.id);
    const topics = await storage.getTopics();
    
    // Check if user already picked a topic? 
    // The requirement says "Le chef de groupe qui choisit une lettre en premier aura le sujet...".
    // It doesn't explicitly say a group can only pick ONE, but it's implied for "Exposé".
    // I'll assume 1 topic per group.
    const alreadyPicked = topics.find(t => t.assignedToUserId === user.id);
    if (alreadyPicked) {
      return res.status(403).json({ message: "You have already chosen a topic." });
    }

    const topic = topics.find(t => t.id === topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    if (topic.assignedToUserId) {
      return res.status(400).json({ message: "Topic already chosen." });
    }

    const updated = await storage.chooseTopic(topicId, user.id);
    
    // Emit event to all connected clients to refresh their topics list
    io.emit("topics-updated", { topicId, userId: user.id, title: updated.title });
    
    res.json(updated);
  });

  // Admin Routes
  app.get(api.admin.listUsers.path, isAdmin, async (req, res) => {
    const allUsers = await storage.listUsers();
    const allTopics = await storage.getTopics();
    
    // Map topics to users for the admin view
    const usersWithTopics = allUsers.map(user => {
      const userTopic = allTopics.find(t => t.assignedToUserId === user.id);
      return {
        ...user,
        topicTitle: userTopic ? userTopic.title : null
      };
    });
    
    res.json(usersWithTopics);
  });

  // Expose game status to any authenticated user (players and admins)
  app.get(api.admin.getGameStatus.path, isAuthenticated, async (req, res) => {
    const isStarted = await storage.getGameStatus();
    res.json({ isStarted });
  });

  app.post(api.admin.toggleGame.path, isAdmin, async (req, res) => {
    try {
      const { isStarted } = api.admin.toggleGame.input.parse(req.body);
      const updated = await storage.setGameStatus(isStarted);
      
      // Emit event to all connected clients to refresh their game status
      io.emit("game-status-updated", { isStarted: updated });
      
      res.json({ isStarted: updated });
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.get(api.admin.downloadReport.path, isAdmin, async (req, res) => {
    try {
      const allUsers = await storage.listUsers();
      const allTopics = await storage.getTopics();

      // Filter out admin users
      const nonAdminUsers = allUsers.filter(u => !u.isAdmin);

      // Create PDF document
      const doc = new PDFDocument();
      const filename = `rapport_final_${new Date().toISOString().split('T')[0]}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      doc.pipe(res);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('Rapport Final - Choix de Sujets', { align: 'center' });
      doc.fontSize(10).text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, { align: 'center' });
      doc.moveDown();

      // Table header and responsive columns
      const leftMargin = 50;
      const rightMargin = 50;
      const pageWidth = doc.page.width;
      const usableWidth = pageWidth - leftMargin - rightMargin;

      // Column widths (proportional) - make the subject column wider
      const col1Width = Math.floor(usableWidth * 0.18); // Chef
      const col2Width = Math.floor(usableWidth * 0.20); // Groupe
      const col3Width = Math.floor(usableWidth * 0.30); // Membres
      const col4Width = usableWidth - (col1Width + col2Width + col3Width); // Sujet Assigné

      const headerY = doc.y;
      const headerFontSize = 10;
      const rowPadding = 6;

      doc.fontSize(headerFontSize).font('Helvetica-Bold');
      doc.text('Chef du Groupe', leftMargin, headerY, { width: col1Width });
      doc.text('Groupe', leftMargin + col1Width, headerY, { width: col2Width });
      doc.text('Membres', leftMargin + col1Width + col2Width, headerY, { width: col3Width });
      doc.text('Sujet Assigné', leftMargin + col1Width + col2Width + col3Width, headerY, { width: col4Width });

      // Horizontal line under headers
      const headerHeight = Math.max(
        doc.heightOfString('Chef du Groupe', { width: col1Width }),
        doc.heightOfString('Groupe', { width: col2Width }),
        doc.heightOfString('Membres', { width: col3Width }),
        doc.heightOfString('Sujet Assigné', { width: col4Width }),
      );

      doc.moveTo(leftMargin - 10, headerY + headerHeight + rowPadding / 2)
         .lineTo(pageWidth - rightMargin, headerY + headerHeight + rowPadding / 2)
         .stroke();

      // Table rows
      doc.font('Helvetica').fontSize(10);
      let yPos = headerY + headerHeight + rowPadding;
      const bottomLimit = doc.page.height - 60; // leave room for signature/footer

      for (const user of nonAdminUsers) {
        const topic = allTopics.find(t => t.assignedToUserId === user.id);
        const username = user.username || 'N/A';
        const groupName = user.groupName || 'N/A';
        const members = user.groupMembers || 'Aucun';
        const topicTitle = topic ? topic.title : 'Aucun sujet assigné';

        // Measure heights for each cell with wrapping
        const h1 = doc.heightOfString(username, { width: col1Width });
        const h2 = doc.heightOfString(groupName, { width: col2Width });
        const h3 = doc.heightOfString(members, { width: col3Width });
        const h4 = doc.heightOfString(topicTitle, { width: col4Width });

        const cellHeight = Math.max(h1, h2, h3, h4) + rowPadding;

        // New page if needed
        if (yPos + cellHeight > bottomLimit) {
          doc.addPage();
          yPos = 50;

          // Redraw headers on new page
          doc.font('Helvetica-Bold').fontSize(headerFontSize);
          doc.text('Chef du Groupe', leftMargin, yPos, { width: col1Width });
          doc.text('Groupe', leftMargin + col1Width, yPos, { width: col2Width });
          doc.text('Membres', leftMargin + col1Width + col2Width, yPos, { width: col3Width });
          doc.text('Sujet Assigné', leftMargin + col1Width + col2Width + col3Width, yPos, { width: col4Width });

          const newHeaderH = Math.max(
            doc.heightOfString('Chef du Groupe', { width: col1Width }),
            doc.heightOfString('Groupe', { width: col2Width }),
            doc.heightOfString('Membres', { width: col3Width }),
            doc.heightOfString('Sujet Assigné', { width: col4Width }),
          );

          doc.moveTo(leftMargin - 10, yPos + newHeaderH + rowPadding / 2)
             .lineTo(pageWidth - rightMargin, yPos + newHeaderH + rowPadding / 2)
             .stroke();

          yPos += newHeaderH + rowPadding;
          doc.font('Helvetica').fontSize(10);
        }

        // Draw each cell with wrapping
        doc.text(username, leftMargin, yPos, { width: col1Width });
        doc.text(groupName, leftMargin + col1Width, yPos, { width: col2Width });
        doc.text(members, leftMargin + col1Width + col2Width, yPos, { width: col3Width });
        doc.text(topicTitle, leftMargin + col1Width + col2Width + col3Width, yPos, { width: col4Width });

        // Move to next row
        yPos += cellHeight;
      }

      // Signature area
      doc.moveDown(2);
      doc.fontSize(10).text('_' + '_'.repeat(40), { align: 'left' });
      doc.text('Administrateur', { align: 'left' });

      doc.end();
    } catch (err) {
      console.error('Error generating PDF report:', err);
      res.status(500).json({ message: 'Error generating PDF report' });
    }
  });

  app.patch(api.admin.approveUser.path, isAdmin, async (req, res) => {
    const userId = Number(req.params.id);
    const { approved } = req.body;
    const updated = await storage.approveUser(userId, approved);
    
    // Emit event to all connected clients to refresh users list
    io.emit("users-updated", { userId, approved });
    
    res.json(updated);
  });

  app.post(api.admin.resetGame.path, isAdmin, async (req, res) => {
    await storage.resetTopics();
    
    // Emit event to all connected clients to refresh topics
    io.emit("topics-updated", { reset: true });
    
    res.json({ message: "Game reset" });
  });

  return httpServer;
}
