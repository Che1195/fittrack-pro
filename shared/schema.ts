import { pgTable, text, serial, timestamp, integer, varchar, jsonb, index, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Mandatory for Replit Auth (using varchar ID as per integration)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  username: text("username"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  trainerId: varchar("trainer_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  goals: text("goals"),
  sessionCost: integer("session_cost"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions_data = pgTable("sessions_data", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  trainerId: varchar("trainer_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  duration: integer("duration").default(60),
  paid: boolean("paid").default(false),
});

export const insertUserSchema = createInsertSchema(users);
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, trainerId: true });
export const insertSessionSchema = createInsertSchema(sessions_data).omit({ id: true, trainerId: true });

export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type Session = typeof sessions_data.$inferSelect;

export type CreateClientRequest = z.infer<typeof insertClientSchema>;
export type CreateSessionRequest = z.infer<typeof insertSessionSchema>;
