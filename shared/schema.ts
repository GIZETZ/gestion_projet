import { pgTable, text, serial, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Nom du chef de groupe
  groupName: text("group_name").notNull(),
  groupMembers: text("group_members").notNull().default(""), // Noms des membres séparés par des virgules
  password: text("password").notNull(), // Simple password or just use name/group as identity
  isAdmin: boolean("is_admin").default(false),
  isApproved: boolean("is_approved").default(false),
});

export const gameSettings = pgTable("game_settings", {
  id: serial("id").primaryKey(),
  isStarted: boolean("is_started").notNull().default(false),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  letter: text("letter").notNull(), // A, B, C, D, E, F
  title: text("title").notNull(), // Le sujet (ex: PRISM)
  assignedToUserId: integer("assigned_to_user_id").references(() => users.id), // Null si pas encore choisi
  isRevealed: boolean("is_revealed").default(false),
});

export const topicsRelations = relations(topics, ({ one }) => ({
  assignedUser: one(users, {
    fields: [topics.assignedToUserId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  groupName: true,
  groupMembers: true,
  password: true,
});

export const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type User = typeof users.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Types for frontend mapping
export type UserWithTopic = User & { topicTitle?: string | null };

