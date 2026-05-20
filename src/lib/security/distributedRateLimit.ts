/** Shared counter via Upstash Redis REST (works across Vercel edge instances). */
export async function checkDistributedRateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number } | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return null;

  const redisKey = `coveriq:rl:${key}`;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const incrRes = await fetch(`${base}/incr/${encodeURIComponent(redisKey)}`, {
      headers,
      signal: AbortSignal.timeout(2000),
    });
    if (!incrRes.ok) return null;

    const incrJson = (await incrRes.json()) as { result?: number };
    const count = Number(incrJson.result ?? 0);
    if (!Number.isFinite(count)) return null;

    if (count === 1) {
      await fetch(`${base}/expire/${encodeURIComponent(redisKey)}/${windowSec}`, {
        headers,
        signal: AbortSignal.timeout(2000),
      });
    }

    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    return { allowed, remaining, resetAt: Date.now() + windowSec * 1000 };
  } catch {
    return null;
  }
}
