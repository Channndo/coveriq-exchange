import { NextResponse, type NextRequest } from "next/server";
import { resolveCorsOrigin } from "./cors";
import { checkRateLimit, clientIp, rateLimitHeaders } from "./rateLimit";

/** Burst limit for HTML + app routes (Syntrix probes the site root). */
export function enforceSiteRateLimit(request: NextRequest): NextResponse | null {
  const ip = clientIp(request);
  const burst = checkRateLimit(`burst:site:${ip}`, 10, 10_000);
  if (!burst.allowed) {
    const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });
    Object.entries(rateLimitHeaders(10, 0, burst.resetAt)).forEach(([k, v]) =>
      headers.set(k, v)
    );
    return new NextResponse("Too many requests. Please try again shortly.", {
      status: 429,
      headers,
    });
  }
  return null;
}

/** Never emit Access-Control-Allow-Origin: * on app pages. */
export function finalizePublicResponse(
  request: NextRequest,
  response: NextResponse
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

  return response;
}

export function publicNext(request: NextRequest): NextResponse {
  return finalizePublicResponse(request, NextResponse.next());
}
