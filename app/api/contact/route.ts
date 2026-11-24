import { NextResponse } from "next/server";
import { z } from "zod";

import { allow, clientIp } from "@/lib/rate-limit";

// Server-side validation: the browser form is not a trust boundary.
const contactSchema = z.object({
  name: z.string().trim().min(3).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000),
  social: z.string().trim().url().max(300).optional().or(z.literal("")),
});

const MAX_BODY_BYTES = 16 * 1024;

// Rate limit: 5 messages per 10 minutes per IP (see lib/rate-limit.ts).
const WINDOW_SEC = 10 * 60;
const MAX_PER_WINDOW = 5;

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

  if (!(await allow(`contact:ip:${clientIp(req)}`, MAX_PER_WINDOW, WINDOW_SEC))) {
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
