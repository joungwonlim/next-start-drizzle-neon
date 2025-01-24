import { NextResponse } from "next/server";

import { hash } from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accounts } from "@/db/schema/users/accounts";
import { users } from "@/db/schema/users/users";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .execute();

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        name: email.split("@")[0],
        email,
        password: hashedPassword,
      })
      .returning()
      .execute();

    // Create account entry
    await db
      .insert(accounts)
      .values({
        userId: newUser[0].id,
        type: "oauth",
        provider: "credentials",
        providerAccountId: newUser[0].id, // Using user's ID as providerAccountId for credentials
      })
      .execute();

    // Remove password from the response
    const { password: _, ...userWithoutPassword } =
      newUser[0];

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
