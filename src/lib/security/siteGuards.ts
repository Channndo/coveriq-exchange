import { NextResponse, type NextRequest } from "next/server";
import { resolveCorsOrigin } from "./cors";
import {
  applyRateLimitHeaders,
  clientIp,
  enforceRateLimit,
  rateLimitBlockedHeaders,
  type RateLimitResult,
} from "./rateLimit";

/** Syntrix sends 12 sequential hits to / — block from request 6 onward. */
export const SITE_BURST_LIMIT = 5;
export const SITE_BURST_WINDOW_SEC = 10;

export async function getSiteRateLimit(request: NextRequest): Promise<RateLimitResult> {
  const ip = clientIp(request);
  return enforceRateLimit(`site:${ip}`, SITE_BURST_LIMIT, SITE_BURST_WINDOW_SEC);
}

export function siteRateLimitResponse(rl: RateLimitResult): NextResponse {
  const headers = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    ...rateLimitBlockedHeaders(rl.limit, rl.resetAt),
  });
  return new NextResponse("Too many requests. Please try again shortly.", {
    status: 429,
    headers,
  });
}

/** Never emit Access-Control-Allow-Origin: * on app pages. */
export function finalizePublicResponse(
  request: NextRequest,
  response: NextResponse,
  siteRl?: RateLimitResult
): NextResponse {
  response.headers.delete("access-control-allow-origin");
  response.headers.delete("Access-Control-Allow-Origin");

  const origin = request.headers.get("origin");
  const allowed = origin ? resolveCorsOrigin(request) : null;
  if (allowed) {
    response.headers.set("Access-Control-Allow-Origin", allowed);
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Vary", "Origin");
  }

  if (siteRl) {
    applyRateLimitHeaders(response.headers, siteRl, false);
  }

  return response;
}

export function publicNext(request: NextRequest, siteRl: RateLimitResult): NextResponse {
  return finalizePublicResponse(request, NextResponse.next(), siteRl);
}
