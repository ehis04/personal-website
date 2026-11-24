import { allow, clientIp } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { buildSystemPrompt } from "@/config/knowledge";

export const runtime = "nodejs";

const MODEL = "claude-haiku-5-5";
const MAX_OUTPUT_TOKENS = 300; // replies are 1-3 sentences; this also caps cost
const MAX_HISTORY = 8; // most recent messages sent to the model
const MAX_BODY_BYTES = 16 * 1024;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        // Only user/assistant turns are accepted: a visitor can never inject a
        // "system" message.
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(600),
      })
    )
    .min(1)
    .max(30),
});

// Abuse limits (see lib/rate-limit.ts): per visitor and across all visitors per UTC day.
// The real spending ceiling is the monthly limit set in the Anthropic Console for the key.
const WINDOW_SEC = 10 * 60;
const MAX_PER_IP = 15; // messages per IP per window
const MAX_PER_DAY = 500; // messages across all visitors per UTC day

async function limited(ip: string): Promise<string | null> {
  const today = new Date().toISOString().slice(0, 10);
  if (!(await allow(`chat:day:${today}`, MAX_PER_DAY, 86400))) {
    return "The assistant has reached its daily limit. Please try again tomorrow.";
  }
  if (!(await allow(`chat:ip:${ip}`, MAX_PER_IP, WINDOW_SEC))) {
    return "You're sending messages quickly. Please wait a few minutes.";
  }
  return null;
}

const text = (s: string, status = 200) =>
  new Response(s, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return NextResponse.json({ error: "The chat isn't switched on yet." }, { status: 503 });
  }
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message too large." }, { status: 413 });
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your message." }, { status: 400 });
  }

  // The API needs the conversation to start and end on a user turn.
  const recent = parsed.data.messages.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== "user") recent.shift();
  if (!recent.length || recent[recent.length - 1].role !== "user") {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const blocked = await limited(clientIp(req));
  if (blocked) return NextResponse.json({ error: blocked }, { status: 429 });

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_OUTPUT_TOKENS,
            system: buildSystemPrompt(),
            // Short conversational answers: keep reasoning light for speed and cost.
            output_config: { effort: "low" },
            messages: recent,
          },
          { signal: req.signal }
        );

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("I can't help with that one. Try asking about Ehis's work or projects."));
        }
        controller.close();
      } catch (err) {
        if (req.signal.aborted) {
          controller.close();
          return;
        }
        // Don't leak provider error details to the browser.
        const msg =
          err instanceof Anthropic.RateLimitError
            ? "The assistant is busy right now. Please try again in a moment."
            : "Sorry, something went wrong. Please try again.";
        controller.enqueue(encoder.encode(msg));
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

// Anything but POST: respond plainly rather than leaking framework defaults.
export function GET() {
  return text("Method not allowed", 405);
}
