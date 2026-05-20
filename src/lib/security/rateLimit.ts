import { checkDistributedRateLimit } from "./distributedRateLimit";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
};

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= limit;
  const remaining = Math.max(0, limit - bucket.count);

  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k);
    }
  }

  return { allowed, remaining, resetAt: bucket.resetAt, limit };
}

/** Prefer Upstash (global); fall back to edge-local memory. */
export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<RateLimitResult> {
  const distributed = await checkDistributedRateLimit(key, limit, windowSec);
  if (distributed) {
    return { ...distributed, limit };
  }
  return memoryRateLimit(key, limit, windowSec * 1000);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

/** On successful responses (Syntrix checks for these on 200s). */
export function rateLimitSuccessHeaders(limit: number, remaining: number): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(remaining),
  };
}

/** On 429 responses. */
export function rateLimitBlockedHeaders(
  limit: number,
  resetAt: number
): Record<string, string> {
  return {
    ...rateLimitSuccessHeaders(limit, 0),
    "Retry-After": String(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))),
  };
}

export function applyRateLimitHeaders(
  headers: Headers,
  rl: RateLimitResult,
  blocked = false
): void {
  const map = blocked
    ? rateLimitBlockedHeaders(rl.limit, rl.resetAt)
    : rateLimitSuccessHeaders(rl.limit, rl.remaining);
  Object.entries(map).forEach(([k, v]) => headers.set(k, v));
}
