import { db } from "./db";
import { users, topics, gameSettings, type User, type InsertUser, type Topic } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listUsers(): Promise<User[]>;
  approveUser(id: number, approved: boolean): Promise<User>;
  
  // Topics
  getTopics(): Promise<(Topic & { assignedUser?: User | null })[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  chooseTopic(topicId: number, userId: number): Promise<Topic>;
  resetTopics(): Promise<void>;
  seedTopics(): Promise<void>;

  // Game Settings
  getGameStatus(): Promise<boolean>;
  setGameStatus(isStarted: boolean): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getGameStatus(): Promise<boolean> {
    const [settings] = await db.select().from(gameSettings).limit(1);
    if (!settings) {
      const [newSettings] = await db.insert(gameSettings).values({ isStarted: false }).returning();
      return newSettings.isStarted;
    }
    return settings.isStarted;
  }

  async setGameStatus(isStarted: boolean): Promise<boolean> {
    const [settings] = await db.select().from(gameSettings).limit(1);
    if (!settings) {
      const [newSettings] = await db.insert(gameSettings).values({ isStarted }).returning();
      return newSettings.isStarted;
    } else {
      const [updated] = await db.update(gameSettings).set({ isStarted }).where(eq(gameSettings.id, settings.id)).returning();
      return updated.isStarted;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async listUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async approveUser(id: number, approved: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isApproved: approved })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getTopics(): Promise<(Topic & { assignedUser?: User | null })[]> {
    // We need to join with users to get the assigned user details
    // Drizzle's query builder with relations is best for this, but standard join works too
    return await db.query.topics.findMany({
      with: {
        assignedUser: true,
      },
      orderBy: (topics, { asc }) => [asc(topics.letter)],
    });
  }

  async getTopic(id: number): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    return topic;
  }

  async chooseTopic(topicId: number, userId: number): Promise<Topic> {
    const [topic] = await db
      .update(topics)
      .set({
        assignedToUserId: userId,
        isRevealed: true,
      })
      .where(eq(topics.id, topicId))
      .returning();
    return topic;
  }

  async resetTopics(): Promise<void> {
    await db
      .update(topics)
      .set({
        assignedToUserId: null,
        isRevealed: false,
      });
  }

  async seedTopics(): Promise<void> {
    const existing = await db.select().from(topics);
    if (existing.length > 0) return;

    const topicData = [
      { letter: "A", title: "Le plan de gestion « PRISM »" },
      { letter: "B", title: "Le plan de gestion « Lean Six Sigma »" },
      { letter: "C", title: "Le plan de gestion « PMBOK »" },
      { letter: "D", title: "Le plan de gestion « Waterfall »" },
      { letter: "E", title: "Le plan de gestion « PRINCE 2 »" },
      { letter: "F", title: "Le plan de gestion « Agile »" },
    ];

    await db.insert(topics).values(topicData);
  }
}

export const storage = new DatabaseStorage();
