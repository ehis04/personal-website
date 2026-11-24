// Fixed-window rate limiting for the API routes.
//
// On Cloudflare Workers (and any serverless host) in-memory counters are per
// instance and reset often, so they only slow casual abuse. When
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set, counters live in
// Upstash Redis instead and hold across every instance. Without them, or if
// Redis is unreachable, this falls back to memory (it never blocks visitors
// because Redis is down). The hard spending ceiling is still the monthly limit
// set in the Anthropic Console.

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryHit(key: string, windowSec: number): number {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    if (memory.size > 5000) {
      memory.forEach((v, k) => {
        if (v.resetAt <= now) memory.delete(k);
      });
      if (memory.size > 5000) memory.clear();
    }
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

async function redisHit(key: string, windowSec: number): Promise<number | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSec, "NX"],
      ]),
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown }[];
    const count = data?.[0]?.result;
    return typeof count === "number" ? count : null;
  } catch {
    return null;
  }
}

/** Counts one hit for `key` and returns true while it is within `max` per `windowSec`. */
export async function allow(key: string, max: number, windowSec: number): Promise<boolean> {
  const count = (await redisHit(`rl:${key}`, windowSec)) ?? memoryHit(key, windowSec);
  return count <= max;
}

/** The visitor's IP: Cloudflare's header first, then the first forwarded address. */
export function clientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
