// db/schema/users/authenticators.ts
// This file defines the schema for the 'authenticators' table.
// It manages user authentication methods.
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Import necessary functions for defining a PostgreSQL table.
import { users } from "./users";

// Import the users schema definition to create a foreign key.

export const authenticators = pgTable(
  "authenticators", // Define the 'authenticators' table.
  {
    credentialID: text("credentialID").notNull().unique(), // Unique credential identifier for the authenticator.
    userId: text("userId") // User ID column, references the users table, and cascades on delete.
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(), // User's account ID on the provider.
    credentialPublicKey: text(
      "credentialPublicKey"
    ).notNull(), // Public key of the authenticator's credential.
    counter: integer("counter").notNull(), // Counter for the authenticator's credential.
    credentialDeviceType: text(
      "credentialDeviceType"
    ).notNull(), // Type of device used for authentication.
    credentialBackedUp: boolean(
      "credentialBackedUp"
    ).notNull(), // Indicates if the credential has been backed up.
    transports: text("transports"), // Authentication transports.
    createdAt: timestamp("created_at").defaultNow(), // Record created time
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date()), // Record updated time, will automatically update
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [
          authenticator.userId,
          authenticator.credentialID,
        ], // Creates a composite primary key using userId and credentialID
      }),
    },
  ]
);

export type Authenticator =
  typeof authenticators.$inferSelect; // Infer the select type for authenticators table.
export type NewAuthenticator =
  typeof authenticators.$inferInsert; // Infer the insert type for authenticators table.
