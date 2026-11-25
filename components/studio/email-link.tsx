"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

// The page never contains the plain email address. The server sends it base64-encoded and this
// decodes it in the browser, so scrapers that only read HTML (most of them) find nothing to
// harvest. Visitors without JavaScript see the "name [at] domain" text instead.
const subscribe = () => () => {};

function useAddress(encoded: string): string {
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return atob(encoded);
      } catch {
        return "";
      }
    },
    () => ""
  );
}

/** A mailto link (the address is filled in after the page loads). */
export function EmailLink({
  encoded,
  className,
  children,
}: {
  encoded: string;
  className?: string;
  children: React.ReactNode;
}) {
  const address = useAddress(encoded);
  return (
    <a href={address ? `mailto:${address}` : "#"} className={className}>
      {children}
    </a>
  );
}

/** The address as text: "name [at] domain" until the page loads, then the real address. */
export function EmailText({ encoded, fallback }: { encoded: string; fallback: string }) {
  const address = useAddress(encoded);
  return <>{address || fallback}</>;
}

/** The Contact tile on the home page: the whole tile is the mailto link. */
export function ContactTile({
  encoded,
  className,
  children,
}: {
  encoded: string;
  className?: string;
  children: React.ReactNode;
}) {
  const address = useAddress(encoded);
  return (
    <a href={address ? `mailto:${address}` : "#"} className={cn("recess reveal group block", className)}>
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </a>
  );
}
