// drizzle.config.ts
// This file is used to configure Drizzle Kit, a tool for generating database migrations.
// This configuration tells Drizzle Kit how to connect to your database and where to find your schema files.
import type { Config } from "drizzle-kit";

// Import the Config type from drizzle-kit.
import { env } from "./env/server";

// Import environment variables from env/server.ts.

export default {
  schema: "./db/schema/index.ts", // Path to your database schema files. This is where Drizzle looks for table definitions.
  out: "./drizzle", // Path to store generated migration files. This directory will be created if it doesn't exist.
  dialect: "postgresql", // Specifies the database dialect (PostgreSQL in this case).
  dbCredentials: {
    // Database connection settings.
    host: env.DATABASE_HOST || "localhost",
    port: Number(env.DATABASE_PORT) || 5432,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    ssl: env.DATABASE_SSL === "true",
  },
  verbose: true, // Enable verbose logging for Drizzle Kit. This will output more information during migration generation.
  strict: true, // Enable strict mode for more strict type checking.
} satisfies Config; // Ensures that the configuration conforms to the Config type.
