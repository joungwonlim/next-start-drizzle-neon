import { NextApiRequest } from "next";
import { Headers } from "next/headers";

// 사용자 에이전트 정보 추출 함수
export function getUserAgent(
  req: NextApiRequest | { headers: Headers } | undefined
): string {
  if (!req) return "";
  let userAgent: string;
  if ("headers" in req) {
    userAgent =
      (req as { headers: Headers }).headers.get(
        "user-agent"
      ) || "";
  } else if (req) {
    userAgent =
      (req as NextApiRequest).headers["user-agent"] || "";
  } else {
    userAgent = "";
  }
  return userAgent;
}

// 클라이언트 IP 주소 추출 함수
export function getClientIp(
  req: NextApiRequest | { headers: Headers } | undefined
): string {
  if (!req) return "127.0.0.1";
  let ip: string = "";
  if ("headers" in req) {
    const xForwardedFor = (
      req as { headers: Headers }
    ).headers.get("x-forwarded-for") as string | null;
    ip =
      (xForwardedFor
        ? xForwardedFor.split(",")[0]
        : (req as { headers: Headers }).headers.get(
            "remote-addr"
          )) || "";
  }

  if (ip) {
    return ip;
  } else if (
    "req" in req &&
    (
      req as NextApiRequest & {
        req: {
          headers: {
            "x-forwarded-for": string | undefined;
          };
        };
      }
    ).req
  ) {
    const forwarded = (
      req as NextApiRequest & {
        req: {
          headers: {
            "x-forwarded-for": string | undefined;
          };
        };
      }
    ).req.headers["x-forwarded-for"] as string | undefined;
    ip = forwarded
      ? forwarded.split(",")[0]
      : ((
          req as NextApiRequest & {
            req: {
              socket: { remoteAddress: string | undefined };
            };
          }
        ).req.socket.remoteAddress ?? "");
  }
  return ip || "127.0.0.1";
}
