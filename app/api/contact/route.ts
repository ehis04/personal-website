import { NextResponse } from "next/server";
import { z } from "zod";

// Server-side validation: the browser form is not a trust boundary.
const contactSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  social: z.string().trim().url().max(300).optional().or(z.literal("")),
});

const MAX_BODY_BYTES = 16 * 1024;

// Best-effort rate limit: 5 messages per 10 minutes per IP. On serverless hosts
// this map is per-instance, so it slows casual abuse but is not a hard guarantee.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

export async function POST(req: Request) {
  const formLink = process.env.GOOGLE_FORM_LINK;
  const fields = {
    name: process.env.GOOGLE_FORM_FIELD_ID_NAME,
    email: process.env.GOOGLE_FORM_FIELD_ID_EMAIL,
    message: process.env.GOOGLE_FORM_FIELD_ID_MESSAGE,
    social: process.env.GOOGLE_FORM_FIELD_ID_SOCIAL,
  };

  // Only ever post to a real Google Form, never to an arbitrary configured URL.
  if (
    !formLink ||
    !formLink.startsWith("https://docs.google.com/forms/") ||
    !fields.name ||
    !fields.email ||
    !fields.message
  ) {
    return NextResponse.json({ error: "Contact form is not configured." }, { status: 503 });
  }

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message too large." }, { status: 413 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many messages. Try again later." }, { status: 429 });
  }

  let parsed;
  try {
    parsed = contactSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  }
  const { name, email, message, social } = parsed.data;

  // URLSearchParams encodes every value, so user text can't inject extra
  // parameters (the old code interpolated raw input into the URL).
  const body = new URLSearchParams({
    [fields.name]: name,
    [fields.email]: email,
    [fields.message]: message,
  });
  if (fields.social && social) body.set(fields.social, social);

  try {
    const res = await fetch(`${formLink.replace(/\/$/, "")}/formResponse`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      redirect: "manual", // Google answers a successful submit with a redirect
    });
    const ok = res.ok || res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400);
    if (!ok) {
      return NextResponse.json({ error: "Could not deliver your message." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not deliver your message." }, { status: 502 });
  }
}
