import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

import { db } from "@/db";
import { userErrorLogs } from "@/db/schema/userActivities/userErrorLogs";
import { env } from "@/env/server";

export async function middleware(request: NextRequest) {
  // NextAuth의 getToken 함수를 사용하여 현재 요청의 인증 토큰을 가져옵니다.
  // 이 토큰에는 인증된 사용자의 정보가 포함되어 있습니다.
  const token = await getToken({
    req: request,
    secret: env.NEXTAUTH_SECRET,
  });

  // GET 요청이 아니거나 API 경로로의 요청인 경우 추적하지 않고 다음 미들웨어로 넘깁니다.
  if (
    request.method !== "GET" ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  try {
    // 토큰이 존재하는 경우 (사용자가 인증된 경우) 활동을 추적합니다.
    if (token) {
      // 사용자 활동을 추적하기 위해 별도의 API 엔드포인트로 요청을 보냅니다.
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/userTrack`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: token.sub, // 토큰의 sub 필드는 사용자의 고유 ID입니다.
            path: request.nextUrl.pathname, // 현재 방문한 페이지의 경로
            action: "page_view", // 수행한 액션 (여기서는 페이지 조회)
            metadata: {
              referrer:
                request.headers.get("referer") || null, // 이전 페이지 URL
              userAgent:
                request.headers.get("user-agent") || null, // 사용자의 브라우저 정보
            },
          }),
        }
      );

      // 활동 추적에 실패한 경우 에러를 로그에 기록합니다.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    }
  } catch (error) {
    // 예외가 발생한 경우 에러를 로그에 기록합니다.
    if (error instanceof Error) {
      try {
        await db.insert(userErrorLogs).values({
          message: error.message,
          userId: token?.sub || "",
          stack: error.stack,
          errorAt: new Date(),
          ipAddress:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "",
          userAgent: request.headers.get("user-agent"),
          errorLocation: request.nextUrl.pathname,
        });
      } catch (dbError) {
        console.error(
          "Failed to save error log to the database: ",
          dbError
        );
      }
      console.error(
        "Failed to track user activity:",
        error
      );
    }
  }

  // 다음 미들웨어나 최종 핸들러로 요청을 전달합니다.
  return NextResponse.next();
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: [
    // _next/static, _next/image, favicon.ico, public 폴더를 제외한 모든 경로에 대해 미들웨어를 실행합니다.
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
