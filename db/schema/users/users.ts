// db/schema/users/users.ts
// This file defines the schema for the 'users' table.
// It includes columns like id, name, email, etc. and tracks creation and update times.
import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import the necessary functions for defining a PostgreSQL table.

export const users = pgTable("users", {
  // Define the 'users' table.
  id: text("id") // User ID column, primary key, and generates a UUID by default
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"), // User name column
  email: text("email").unique(), // User email column, unique value
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }), // Email verification timestamp column
  image: text("image"), // User image URL column
  createdAt: timestamp("created_at").defaultNow(), // Record created time
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
});

export type User = typeof users.$inferSelect; // Infer the select type for users table.
export type NewUser = typeof users.$inferInsert; // Infer the insert type for users table.
