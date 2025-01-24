// db/schema/userActivitis/userSigninLogs.ts
// This file defines the schema for the 'user_signin_logs' table.
// It tracks user sign-in activities.
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import necessary functions for defining a PostgreSQL table.
import { users } from "../users/users";

// Import the users schema definition to create a foreign key.

export const userSigninLogs = pgTable("user_signin_logs", {
  // Define the 'user_signin_logs' table.
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // Sign-in log ID, primary key, generates UUID by default.
  userId: text("user_id") // User ID column, references the users table, and cascades on delete.
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  signInAt: timestamp("sign_in_at").defaultNow().notNull(), // Sign-in timestamp
  ipAddress: text("ip_address"), // IP address from the sign-in request
  userAgent: text("user_agent"), // User agent string
  createdAt: timestamp("created_at").defaultNow(), // Record created time
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
});

export type UserSigninLog =
  typeof userSigninLogs.$inferSelect; // Infer the select type for userSigninLogs table.
export type NewUserSigninLog =
  typeof userSigninLogs.$inferInsert; // Infer the insert type for userSigninLogs table.
