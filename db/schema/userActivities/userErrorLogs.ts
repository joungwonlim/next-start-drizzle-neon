// db/schema/userActivitis/userErrorLogs.ts
// This file defines the schema for the 'user_error_logs' table.
// It tracks errors that occur in the application.
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import necessary functions for defining a PostgreSQL table.
import { users } from "../users/users";

// Import the users schema definition to create a foreign key.

export const userErrorLogs = pgTable("user_error_logs", {
  // Define the 'user_error_logs' table.
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // Error log ID, primary key, and generates a UUID by default
  userId: text("user_id") // User ID column, references the users table, and cascades on delete.
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(), // Error message.
  stack: text("stack"), // Error stack trace.
  errorAt: timestamp("error_at").defaultNow().notNull(), // Time the error occurred.
  ipAddress: text("ip_address"), // IP address where the error occurred.
  userAgent: text("user_agent"), // User agent string of the user
  createdAt: timestamp("created_at").defaultNow(), // Record created time
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
});

export type UserErrorLog =
  typeof userErrorLogs.$inferSelect; // Infer the select type for userErrorLogs table.
export type NewUserErrorLog =
  typeof userErrorLogs.$inferInsert; // Infer the insert type for userErrorLogs table.
