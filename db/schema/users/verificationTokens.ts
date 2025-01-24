// db/schema/users/verificationTokens.ts
// This file defines the schema for the 'verificationTokens' table.
// It manages email verification tokens.
import {
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import necessary functions for defining a PostgreSQL table.

export const verificationTokens = pgTable(
  "verificationTokens", // Define the 'verificationTokens' table.
  {
    identifier: text("identifier").notNull(), // Verification token identifier.
    token: text("token").notNull(), // Verification token.
    expires: timestamp("expires", {
      mode: "date",
    }).notNull(), // Verification token expiration time.
    createdAt: timestamp("created_at").defaultNow(), // Record created time
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [
          verificationToken.identifier,
          verificationToken.token,
        ], // Creates a composite primary key using identifier and token.
      }),
    },
  ]
);

export type VerificationToken =
  typeof verificationTokens.$inferSelect; // Infer the select type for verificationTokens table.
export type NewVerificationToken =
  typeof verificationTokens.$inferInsert; // Infer the insert type for verificationTokens table.
