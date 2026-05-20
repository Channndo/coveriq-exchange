import { NextResponse, type NextRequest } from "next/server";
import { applyCorsHeaders, resolveCorsOrigin } from "./cors";
import { checkRateLimit, clientIp, rateLimitHeaders } from "./rateLimit";

const WEBHOOK_PATH = "/api/stripe/webhook";

function rateLimitForPath(pathname: string): { limit: number; windowMs: number } {
  if (pathname.startsWith(WEBHOOK_PATH)) {
    return { limit: 200, windowMs: 60_000 };
  }
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/agent-profile") ||
    pathname.startsWith("/api/me/")
  ) {
    return { limit: 20, windowMs: 60_000 };
  }
  return { limit: 60, windowMs: 60_000 };
}

/** CORS allowlist + rate limiting for /api/* (no wildcard ACO). */
export function handleApiRoute(request: NextRequest): NextResponse {
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

  const { limit, windowMs } = rateLimitForPath(pathname);
  const ip = clientIp(request);
  const burst = checkRateLimit(`burst:${pathname}:${ip}`, 10, 10_000);
  const rl = checkRateLimit(`api:${pathname}:${ip}`, limit, windowMs);

  if (!burst.allowed) {
    Object.entries(rateLimitHeaders(10, 0, burst.resetAt)).forEach(([k, v]) =>
      headers.set(k, v)
    );
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers }
    );
  }

  Object.entries(rateLimitHeaders(limit, rl.remaining, rl.resetAt)).forEach(([k, v]) =>
    headers.set(k, v)
  );

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers }
    );
  }

  const response = NextResponse.next({ request });
  applyCorsHeaders(request, response.headers);
  Object.entries(rateLimitHeaders(limit, rl.remaining, rl.resetAt)).forEach(([k, v]) =>
    response.headers.set(k, v)
  );
  return response;
}
