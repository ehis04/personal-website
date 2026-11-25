// The site's only server code. Every page is a static file served straight from Cloudflare's
// edge (see "assets" in wrangler.jsonc). This Worker runs ONLY for /api/* (the Ask assistant),
// so page loads never wake an app server and never hit the free plan's 10 ms CPU limit.
//
// It talks to Anthropic with plain fetch (no SDK) to stay light: waiting on the network is
// free, only our own computing counts against the CPU limit.
import { buildSystemPrompt } from "../config/knowledge";
import { allow, clientIp, type LimitConfig } from "../lib/rate-limit";

interface Env extends LimitConfig {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ANTHROPIC_API_KEY?: string;
  /** Workers AI (text-to-speech). */
  AI?: { run(model: string, input: unknown, options?: unknown): Promise<unknown> };
  /** Cloudflare's built-in per-visitor limiter (wrangler.jsonc "ratelimits"). */
  API_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

const MODEL = "claude-haiku-5-5";
const MAX_OUTPUT_TOKENS = 300; // replies are 1-3 sentences; this also caps cost
const MAX_HISTORY = 8; // most recent messages sent to the model
const MAX_BODY_BYTES = 16 * 1024;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 600;

// Abuse limits (see lib/rate-limit.ts): per visitor and across all visitors per UTC day.
// The real spending ceiling is the monthly limit set in the Anthropic Console for the key.
const WINDOW_SEC = 10 * 60;
const MAX_PER_IP = 15;
const MAX_PER_DAY = 500;

// Natural voices (Deepgram Aura-1 on Workers AI). Free plan: ~10,000 neurons/day (about 7,000
// characters); beyond that the call fails, it never charges, and the page falls back to the
// device's own voice.
const VOICES = ["helios", "angus", "orion", "arcas", "perseus", "orpheus", "zeus", "athena", "asteria", "luna", "stella", "hera"];
const SPEAK_MAX_CHARS = 500;
const SPEAK_PER_IP = 8; // per 10 minutes
const SPEAK_PER_DAY = 30; // across all visitors, protects the daily free allowance

// Only this site's own pages may call the API from a browser. (Scripts and curl send no Origin
// and are held back by the rate limits instead.)
const ALLOWED_HOSTS = new Set(["ehisoghina.com", "www.ehisoghina.com", "ehisoghina.ehisoghina.workers.dev", "localhost"]);
function crossSite(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return !ALLOWED_HOSTS.has(new URL(origin).hostname);
  } catch {
    return true;
  }
}

const baseHeaders = { "cache-control": "no-store", "x-content-type-options": "nosniff" };
const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { ...baseHeaders, "content-type": "application/json" } });
const plain = (text: string, status = 200) =>
  new Response(text, { status, headers: { ...baseHeaders, "content-type": "text/plain; charset=utf-8" } });

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Only user/assistant turns are accepted, so a visitor can never inject a "system" message. */
function parseMessages(input: unknown): ChatMessage[] | null {
  const list = (input as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(list) || list.length < 1 || list.length > MAX_MESSAGES) return null;
  const out: ChatMessage[] = [];
  for (const m of list) {
    const role = (m as { role?: unknown })?.role;
    const raw = (m as { content?: unknown })?.content;
    if ((role !== "user" && role !== "assistant") || typeof raw !== "string") return null;
    const content = raw.trim();
    if (content.length < 1 || content.length > MAX_MESSAGE_CHARS) return null;
    out.push({ role, content });
  }
  return out;
}

async function chat(request: Request, env: Env): Promise<Response> {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "The chat isn't switched on yet." }, 503);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "Message too large." }, 413);
  }

  let parsed: ChatMessage[] | null;
  try {
    parsed = parseMessages(await request.json());
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!parsed) return json({ error: "Please check your message." }, 400);

  // The API needs the conversation to start and end on a user turn.
  const recent = parsed.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== "user") recent.shift();
  if (!recent.length || recent[recent.length - 1].role !== "user") {
    return json({ error: "Invalid conversation." }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (!(await allow(`chat:day:${today}`, MAX_PER_DAY, 86400, env))) {
    return json({ error: "The assistant has reached its daily limit. Please try again tomorrow." }, 429);
  }
  if (!(await allow(`chat:ip:${clientIp(request)}`, MAX_PER_IP, WINDOW_SEC, env))) {
    return json({ error: "You're sending messages quickly. Please wait a few minutes." }, 429);
  }

  let upstream: Response;
  try {
    upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: buildSystemPrompt(),
        // Short conversational answers: keep reasoning light for speed and cost.
        output_config: { effort: "low" },
        messages: recent,
        stream: true,
      }),
      signal: request.signal,
    });
  } catch {
    return plain("Sorry, something went wrong. Please try again.");
  }

  // Don't leak provider error details to the browser.
  if (!upstream.ok || !upstream.body) {
    return plain(
      upstream.status === 429
        ? "The assistant is busy right now. Please try again in a moment."
        : "Sorry, something went wrong. Please try again."
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            let event: {
              type?: string;
              delta?: { type?: string; text?: string; stop_reason?: string };
            };
            try {
              event = JSON.parse(data);
            } catch {
              continue;
            }
            if (event.type === "content_block_delta" && event.delta?.type === "text_delta" && event.delta.text) {
              controller.enqueue(encoder.encode(event.delta.text));
            } else if (event.type === "message_delta" && event.delta?.stop_reason === "refusal") {
              controller.enqueue(encoder.encode("I can't help with that one. Try asking about Ehis's work or projects."));
            } else if (event.type === "error") {
              controller.enqueue(encoder.encode("Sorry, something went wrong. Please try again."));
            }
          }
        }
        controller.close();
      } catch {
        if (request.signal.aborted) {
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode("Sorry, something went wrong. Please try again."));
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(body, { headers: { ...baseHeaders, "content-type": "text/plain; charset=utf-8" } });
}

async function speak(request: Request, env: Env): Promise<Response> {
  if (!env.AI) return json({ error: "The natural voice isn't switched on." }, 503);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ error: "Too large." }, 413);

  let text = "";
  let voice = "helios";
  try {
    const body = (await request.json()) as { text?: unknown; voice?: unknown };
    if (typeof body.text !== "string") throw new Error("text");
    text = body.text.trim();
    if (typeof body.voice === "string") voice = body.voice;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!text || text.length > SPEAK_MAX_CHARS || !VOICES.includes(voice)) {
    return json({ error: "Please check the text and voice." }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (!(await allow(`speak:day:${today}`, SPEAK_PER_DAY, 86400, env))) {
    return json({ error: "The natural voice has reached its daily limit." }, 429);
  }
  if (!(await allow(`speak:ip:${clientIp(request)}`, SPEAK_PER_IP, WINDOW_SEC, env))) {
    return json({ error: "Please wait a few minutes before using the voice again." }, 429);
  }

  try {
    const out = (await env.AI.run("@cf/deepgram/aura-1", { text, speaker: voice, encoding: "mp3" }, { returnRawResponse: true })) as Response;
    if (!out.ok || !out.body) return json({ error: "The natural voice is unavailable right now." }, 502);
    return new Response(out.body, { headers: { ...baseHeaders, "content-type": "audio/mpeg" } });
  } catch {
    return json({ error: "The natural voice is unavailable right now." }, 502);
  }
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/chat" || pathname === "/api/speak") {
      if (request.method !== "POST") return plain("Method not allowed", 405);
      if (crossSite(request)) return json({ error: "Forbidden." }, 403);
      if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
        return json({ error: "Expected JSON." }, 415);
      }
      // Burst limiter per visitor (Cloudflare's own limiter; also guards against rapid scripts).
      if (env.API_LIMITER) {
        const { success } = await env.API_LIMITER.limit({ key: clientIp(request) });
        if (!success) return json({ error: "Too many requests. Please slow down." }, 429);
      }
      return pathname === "/api/chat" ? chat(request, env) : speak(request, env);
    }
    if (pathname.startsWith("/api/")) return json({ error: "Not found." }, 404);
    // Only /api/* reaches this Worker; anything else is served as a static file.
    return env.ASSETS.fetch(request);
  },
};

export default worker;
