// db/schema/users/sessions.ts
// This file defines the schema for the 'sessions' table.
// It manages user sessions and their expiry.
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import the necessary functions for defining a PostgreSQL table.
import { users } from "./users";

// Import the users schema definition to create a foreign key.

export const sessions = pgTable("sessions", {
  // Define the 'sessions' table.
  sessionToken: text("sessionToken").primaryKey(), // Session token, acts as primary key.
  userId: text("userId") // User ID column, references the users table, and cascades on delete.
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(), // Session expiration time.
  createdAt: timestamp("created_at").defaultNow(), // Record created time
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
});

export type Session = typeof sessions.$inferSelect; // Infer the select type for sessions table.
export type NewSession = typeof sessions.$inferInsert; // Infer the insert type for sessions table.
