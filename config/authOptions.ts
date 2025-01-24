// config/authOptions.ts
// This file configures NextAuth.js settings for authentication providers and database adapter.
// It manages authentication providers, user sign-in logging, and user events
import { DrizzleAdapter } from "@auth/drizzle-adapter";
// Import the Drizzle adapter for NextAuth.
import { eq } from "drizzle-orm";
// Import eq function for database queries.
import { type AuthOptions } from "next-auth";
// Import the AuthOptions type from next-auth.
import CredentialsProvider from "next-auth/providers/credentials";
// Import Credentials provider for custom authentication.
import GoogleProvider from "next-auth/providers/google";
// Import Google provider for NextAuth.
import KakaoProvider from "next-auth/providers/kakao";
// Import Kakao provider for NextAuth.
import NaverProvider from "next-auth/providers/naver";

// Import Naver provider for NextAuth.
import { db } from "@/db";
// Import database connection from db/index.ts.
import { users } from "@/db/schema/users/users";
// Import the users schema definition from db/schema/users/users.ts.
import { env } from "@/env/server";

// Import environment variables from env/server.ts.
import { authCallbacks } from "./authCallbacks";
// Import authCallbacks from config/authCallbacks.ts
import { authEvents } from "./authEvents";

// Import authEvents from config/authEvents.ts

// Configuration for NextAuth.js
export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db), // Set the database adapter for NextAuth to Drizzle adapter.
  providers: [
    // Configuration for Google authentication provider.
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // Configuration for Kakao authentication provider.
    KakaoProvider({
      clientId: env.KAKAO_CLIENT_ID,
      clientSecret: env.KAKAO_CLIENT_SECRET,
    }),
    // Configuration for Naver authentication provider.
    NaverProvider({
      clientId: env.NAVER_CLIENT_ID,
      clientSecret: env.NAVER_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email));
        if (!user) return null;
        // TODO: hash 비교
        if (credentials.password !== "password")
          return null;
        return user;
      },
    }),
  ],
  callbacks: authCallbacks, // Apply the auth callback configurations from authCallbacks.ts.
  events: authEvents, // Apply the auth event configurations from authEvents.ts.
};
