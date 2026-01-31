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

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
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
    if (req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Middleware to check if admin
  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await storage.getUser(req.session.userId);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };

  // Seed topics on startup
  await storage.seedTopics();

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
        // Make first user admin and approved automatically
        isAdmin: isFirstUser ? true : false,
        isApproved: isFirstUser ? true : false
      }); // Note: schema needs to handle this or we update after. 
      // Actually createUser takes InsertUser which doesn't have isAdmin/isApproved in insertSchema usually.
      // Let's check schema.
      
      // If schema doesn't allow passing isAdmin in createUser (it's defaulted in DB), we update it.
      if (isFirstUser) {
        await db.update(users).set({ isAdmin: true, isApproved: true }).where(eq(users.id, user.id));
        user.isAdmin = true;
        user.isApproved = true;
      }

      req.session.userId = user.id;
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

      req.session.userId = user.id;
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
    if (!req.session.userId) return res.status(401).json({ message: "Not logged in" });
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json(user);
  });

  // Topics Routes
  app.get(api.topics.list.path, async (req, res) => {
    const topics = await storage.getTopics();
    res.json(topics);
  });

  app.post(api.topics.choose.path, isAuthenticated, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
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

  app.patch(api.admin.approveUser.path, isAdmin, async (req, res) => {
    const userId = Number(req.params.id);
    const { approved } = req.body;
    const updated = await storage.approveUser(userId, approved);
    res.json(updated);
  });

  app.post(api.admin.resetGame.path, isAdmin, async (req, res) => {
    await storage.resetTopics();
    res.json({ message: "Game reset" });
  });

  return httpServer;
}
