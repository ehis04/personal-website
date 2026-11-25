"use client";

import Link from "next/link";

// Shown inside the site layout (nav and footer stay) when a page fails to render.
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-6 px-6 pt-24 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-dim)]">Something went wrong</p>
      <h1 className="font-display text-extrude text-4xl md:text-6xl">That page didn&apos;t load</h1>
      <p className="max-w-md text-[var(--ink-dim)]">Please try again. If it keeps happening, the rest of the site should still work.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-[var(--green)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full px-6 py-3 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10">
          Back to home
        </Link>
      </div>
    </div>
  );
}
