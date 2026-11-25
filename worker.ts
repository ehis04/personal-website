// Custom Worker entry (wrangler.jsonc "main"). It wraps the OpenNext handler and keeps the
// finished HTML of the static pages in Cloudflare's edge cache.
//
// Why: every page on this site is static, but without this each visit that lands on a cold
// Worker has to start the whole Next.js server first (0.5 to 0.9 s to the first byte). A
// cache hit skips that and answers in about 0.1 s.
//
// Safety:
//  - only plain GET requests for the known HTML pages are cached (no query strings, no
//    client-side navigation payloads, nothing under /api);
//  - the cache key includes the build id, so a new deploy never serves an old page;
//  - on the www host the app answers with a redirect, which is never cached.
// The Cache API does not run on *.workers.dev, only on the custom domain.
import handler from "./.open-next/worker.js";

// OpenNext's generated entry also exports these Durable Object classes; keep them exported.
export { BucketCachePurge, DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  [key: string]: unknown;
}
interface Ctx {
  waitUntil(promise: Promise<unknown>): void;
}

const PAGES = /^\/(?:|experience|projects|research|cv|ask|platforms|privacy|research\/[a-z0-9-]+)\/?$/;
const TTL_SECONDS = 60 * 60 * 24;

let buildId: string | undefined;

async function currentBuildId(env: Env, request: Request): Promise<string> {
  if (!buildId) {
    try {
      const res = await env.ASSETS.fetch(new Request(new URL("/BUILD_ID", request.url)));
      buildId = (await res.text()).trim().slice(0, 40) || "unknown";
    } catch {
      buildId = "unknown";
    }
  }
  return buildId;
}

function isCacheable(request: Request, url: URL): boolean {
  if (request.method !== "GET" || url.search) return false;
  if (!PAGES.test(url.pathname)) return false;
  const h = request.headers;
  if (h.has("rsc") || h.has("next-router-prefetch") || h.has("range")) return false;
  return (h.get("accept") ?? "").includes("text/html");
}

const worker = {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const url = new URL(request.url);
    if (!isCacheable(request, url)) return handler.fetch(request, env, ctx);

    const cache = (caches as unknown as { default: Cache }).default;
    const key = new Request(`${url.origin}${url.pathname}?build=${await currentBuildId(env, request)}`);

    const hit = await cache.match(key);
    if (hit) {
      const res = new Response(hit.body, hit);
      res.headers.set("cache-control", "public, max-age=0, must-revalidate");
      res.headers.set("x-edge-cache", "HIT");
      return res;
    }

    const res: Response = await handler.fetch(request, env, ctx);
    if (res.status === 200 && (res.headers.get("content-type") ?? "").includes("text/html")) {
      const copy = new Response(res.clone().body, res);
      copy.headers.set("cache-control", `public, max-age=0, s-maxage=${TTL_SECONDS}`);
      copy.headers.delete("set-cookie");
      ctx.waitUntil(cache.put(key, copy));
    }
    return res;
  },
};

export default worker;
