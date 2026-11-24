import "./(site)/studio.css";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="studio flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-dim)]">404</p>
      <h1 className="font-display text-extrude text-5xl md:text-7xl">Page not found</h1>
      <p className="max-w-md text-[var(--ink-dim)]">That page doesn&apos;t exist or has moved.</p>
      <Link
        href="/"
        className="rounded-full bg-[var(--green)] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
