import type { NextRequest } from "next/server";

function parseAllowedOrigins(): string[] {
  const fromEnv = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean);
  const defaults = [
    "https://agents.cover-iq.com",
    "https://cover-iq.com",
    "https://www.cover-iq.com",
  ];
  if (process.env.NODE_ENV === "development") {
    defaults.push("http://localhost:3002", "http://127.0.0.1:3002");
  }
  return [...new Set([...(fromEnv ?? []), ...defaults])];
}

const ALLOWED_ORIGINS = parseAllowedOrigins();

export function resolveCorsOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

export function applyCorsHeaders(request: NextRequest, headers: Headers): void {
  const allowed = resolveCorsOrigin(request);
  if (allowed) {
    headers.set("Access-Control-Allow-Origin", allowed);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, X-Requested-With, Stripe-Signature"
  );
  headers.set("Access-Control-Max-Age", "86400");
}
