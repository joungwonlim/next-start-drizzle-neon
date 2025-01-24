// src/app/api/track-activity/route.ts
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { userActivityLogs } from "@/db/schema/userActivities/userActivityLogs";
import { userErrorLogs } from "@/db/schema/userActivities/userErrorLogs";

export async function POST(req: NextRequest) {
  try {
    const { userId, path, action, metadata } =
      await req.json();
    await db.insert(userActivityLogs).values({
      userId,
      path,
      action,
      metadata,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to track user activity and save error log: ",
        error
      );

      // 오류 정보를 errorLogs 테이블에 저장
      try {
        const errorMessage = error.message;
        const errorStack = error.stack;
        await db.insert(userErrorLogs).values({
          userId: userId || "",
          message: errorMessage,
          stack: errorStack,
          errorLocation: "track-activity API route",
          ipAddress:
            req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "",
          userAgent: req.headers.get("user-agent"),
        });
        return NextResponse.json(
          {
            success: false,
            message:
              "Failed to track user activity and save error log",
          },
          { status: 500 }
        );
      } catch (dbError) {
        console.error(
          "Failed to save error log to the database: ",
          dbError
        );
        return NextResponse.json(
          {
            success: false,
            message:
              "Failed to track user activity and save error log to the database",
          },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to track user activity",
      },
      { status: 500 }
    );
  }
}
