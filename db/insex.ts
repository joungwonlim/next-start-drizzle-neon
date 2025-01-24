// db/index.ts
// This file is responsible for creating a database connection using Drizzle ORM.
// It uses the Neon driver for serverless PostgreSQL.
import { neon, neonConfig } from "@neondatabase/serverless";
// Import Neon database-specific functions.
import { drizzle } from "drizzle-orm/neon-http";

// Import the Drizzle ORM function to create the database client.
import { env } from "../env/server";
import * as schema from "./schema";

// Import environment variables from env/server.ts.

neonConfig.fetchConnectionCache = true; // Enable connection caching for Neon. This improves performance for serverless environments.

const sql = neon(env.DATABASE_URL); // Create a Neon client using the database URL from environment variables.

export const db = drizzle(sql, { schema }); // Create a Drizzle database client using the Neon client. This is what you will use to query the database.
