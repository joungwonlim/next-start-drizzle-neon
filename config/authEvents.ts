// config/authEvents.ts
// This file defines the event handlers for NextAuth.js, focusing on signOut and error logging.
// It captures user sign-out information and errors, and saves it to database tables.
import { NextApiRequest } from "next";

// Import the NextApiRequest type from next.

import { type AuthConfig } from "@auth/core";
// Import the AuthConfig type from @auth/core.
import { type AdapterSession } from "@auth/core/adapters";

// Import the AdapterSession type from @auth/core/adapters.

import { db } from "@/db";
// Import the database connection from db/index.ts.
import { userSigninLogs } from "@/db/schema/userActivities/userSigninLogs";

// Import the user sign-in logs schema from db/schema/userActivities/userSigninLogs.ts.

import { getClientIp, getUserAgent } from "./userAgent";

// Import utility functions for getting IP and user agent from userAgent.ts.

// Define the event handlers for NextAuth.js.
export const authEvents: AuthConfig["events"] = {
  // Event handler to be triggered when a user signs out.
  async signOut({
    session,
    req,
  }: {
    session: void | AdapterSession | null | undefined;
    req: NextApiRequest | undefined;
  }) {
    // Log user sign-out information.
    if (session?.user?.id) {
      const ipAddress = getClientIp(req); // Get IP address from the request.
      const userAgent = getUserAgent(req); // Get user agent from the request.

      // Insert user sign-out information into the userSigninLogs table.
      await db.insert(userSigninLogs).values({
        userId: session.user.id,
        signInAt: new Date(),
        ipAddress: ipAddress,
        userAgent: userAgent,
      });
    }
  },
  // Event handler to be triggered when an error occurs.
  async error({
    error,
    req,
  }: {
    error: Error;
    req: NextApiRequest | undefined;
  }) {
    // Log error information.
    const ipAddress = getClientIp(req); // Get IP address from the request.
    const userAgent = getUserAgent(req); // Get user agent from the request.

    if (error instanceof Error) {
      const errorMessage = error.message || "unknownError"; // Get the error message or use a default message.
      const userId =
        req && "userId" in req ? req.userId : null; // Extract user ID from request or set to null
      if (userId) {
        // Insert user sign-in information into the userSigninLogs table.
        await db.insert(userSigninLogs).values({
          userId,
          signInAt: new Date(),
          ipAddress: ipAddress,
          userAgent: userAgent,
        });
      } else {
        // Insert default sign-in information if user id is not found
        await db.insert(userSigninLogs).values({
          userId: "notUserId",
          signInAt: new Date(),
          ipAddress: ipAddress,
          userAgent: userAgent,
        });
      }
    }
  },
};
