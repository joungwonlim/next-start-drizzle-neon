// config/authCallbacks.ts
// This file defines the callback functions for NextAuth.js.
// It handles the signIn callback, which logs user sign-in information.
import {
  Account,
  type CallbacksOptions,
  Profile,
} from "next-auth";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

// Import the CallbacksOptions type from next-auth.
import { db } from "@/db";
// Import the database connection from db/index.ts.
import { userSigninLogs } from "@/db/schema/userActivities/userSigninLogs";

// Import the user sign-in logs schema from db/schema/userActivities/userSigninLogs.ts.

// Define the callbacks for NextAuth.js.
export const authCallbacks: CallbacksOptions = {
  signIn: async ({
    user,
    account,
    profile,
    credentials,
  }: {
    user: User | AdapterUser;
    account: Account | null;
    profile?: Profile | undefined;
    credentials?: Record<string, any> | undefined;
  }) => {
    console.log(
      user,
      account,
      profile,
      credentials,
      "signIn"
    ); // Log sign-in information for debugging purposes.
    if (!user) return false; // If no user is provided return false

    // Get IP address and user agent from the request header
    const ipAddress =
      (this.request?.headers.get("x-forwarded-for") ??
        this.request?.headers.get("x-real-ip")) ||
      this.request?.headers.get("host");
    const userAgent =
      this.request?.headers.get("user-agent") || null;

    // Insert user sign-in information into the userSigninLogs table.
    await db.insert(userSigninLogs).values({
      userId: user.id,
      ipAddress: ipAddress,
      userAgent: userAgent,
    });
    return true; // Return true to allow the sign-in.
  },
};
