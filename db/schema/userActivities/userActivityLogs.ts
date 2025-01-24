// db/schema/userActivitis/userActivityLogs.ts
// This file defines the schema for the 'user_activity_logs' table.
// It tracks user activities and their details.
import {
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import necessary functions for defining a PostgreSQL table.
import { users } from "../users/users";

// Import the users schema definition to create a foreign key.

export const userActivityLogs = pgTable(
  "user_activity_logs",
  {
    // Define the 'user_activity_logs' table.
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()), // Activity log ID, primary key and generates UUID by default
    userId: text("user_id") // User ID column, references the users table, and cascades on delete.
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    path: text("path").notNull(), // Path column
    action: text("action").notNull(), // Action column
    metadata: jsonb("metadata"), // Metadata column
    createdAt: timestamp("created_at").defaultNow(), // Record created time
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
  }
);

export type UserActivityLog =
  typeof userActivityLogs.$inferSelect; // Infer the select type for userActivityLogs table.
export type NewUserActivityLog =
  typeof userActivityLogs.$inferInsert; // Infer the insert type for userActivityLogs table.
