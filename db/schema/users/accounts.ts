// db/schema/users/accounts.ts
// This file defines the schema for the 'accounts' table.
// It includes OAuth provider account information and links accounts to users.
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
// Import necessary functions for defining a PostgreSQL table.
import type { AdapterAccount } from "next-auth/adapters";

// Import the adapter account type for NextAuth.
import { users } from "./users";

// Import the users schema definition to create a foreign key.

export const accounts = pgTable(
  "accounts", // Define the 'accounts' table.
  {
    userId: text("userId") // User ID, references the users table, and cascades on delete.
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type")
      .$type<AdapterAccount["type"]>()
      .notNull(), // Type of account from NextAuth adapter.
    provider: text("provider").notNull(), // Name of the provider (e.g., Google, Kakao).
    providerAccountId: text("providerAccountId").notNull(), // Unique account ID from the provider.
    refresh_token: text("refresh_token"), // Refresh token from the provider.
    access_token: text("access_token"), // Access token from the provider.
    expires_at: integer("expires_at"), // Token expiration timestamp.
    token_type: text("token_type"), // Token type.
    scope: text("scope"), // Token scopes.
    id_token: text("id_token"), // ID token.
    session_state: text("session_state"), // Session state.
    createdAt: timestamp("created_at").defaultNow(), // Record created time
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [
          account.provider,
          account.providerAccountId,
        ],
      }),
    },
  ]
);

export type Account = typeof accounts.$inferSelect; // Infer the select type for accounts table.
export type NewAccount = typeof accounts.$inferInsert; // Infer the insert type for accounts table.
