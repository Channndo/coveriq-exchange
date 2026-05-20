import { NextResponse, type NextRequest } from "next/server";
import { applyCorsHeaders, resolveCorsOrigin } from "./cors";
import {
  applyRateLimitHeaders,
  clientIp,
  enforceRateLimit,
  rateLimitBlockedHeaders,
} from "./rateLimit";
import { SITE_BURST_LIMIT, SITE_BURST_WINDOW_SEC } from "./siteGuards";

const WEBHOOK_PATH = "/api/stripe/webhook";

function rateLimitForPath(pathname: string): { limit: number; windowSec: number } {
  if (pathname.startsWith(WEBHOOK_PATH)) {
    return { limit: 200, windowSec: 60 };
  }
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/agent-profile") ||
    pathname.startsWith("/api/me/")
  ) {
    return { limit: 20, windowSec: 60 };
  }
  return { limit: 60, windowSec: 60 };
}

/** CORS allowlist + rate limiting for /api/* (no wildcard ACO). */
export async function handleApiRoute(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const headers = new Headers();
  applyCorsHeaders(request, headers);

  const origin = request.headers.get("origin");
  if (origin && !resolveCorsOrigin(request)) {
    return NextResponse.json({ error: "Origin not allowed." }, { status: 403, headers });
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const ip = clientIp(request);
  const burst = await enforceRateLimit(
    `burst:${pathname}:${ip}`,
    SITE_BURST_LIMIT,
    SITE_BURST_WINDOW_SEC
  );

  if (!burst.allowed) {
    Object.entries(rateLimitBlockedHeaders(burst.limit, burst.resetAt)).forEach(([k, v]) =>
      headers.set(k, v)
    );
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers }
    );
  }

  const { limit, windowSec } = rateLimitForPath(pathname);
  const rl = await enforceRateLimit(`api:${pathname}:${ip}`, limit, windowSec);

  applyRateLimitHeaders(headers, rl, false);

  if (!rl.allowed) {
    Object.entries(rateLimitBlockedHeaders(rl.limit, rl.resetAt)).forEach(([k, v]) =>
      headers.set(k, v)
    );
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers }
    );
  }

  const response = NextResponse.next({ request });
  applyCorsHeaders(request, response.headers);
  applyRateLimitHeaders(response.headers, rl, false);
  applyRateLimitHeaders(response.headers, burst, false);
  return response;
}
