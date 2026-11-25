"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { navLinks as links } from "@/config/nav";
import { profile } from "@/config/studio";
import { cn } from "@/lib/utils";


export function StudioNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On a narrow phone the tabs scroll sideways: centre the current page's tab. This sets
  // scrollLeft directly. scrollIntoView() must not be used here: Chrome then starts keyboard
  // Tab navigation from that tab and skips the "Skip to content" link and Home.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
  }, [pathname]);
  const pill =
    "pointer-events-auto rounded-full bg-black/65 ring-1 ring-white/10 shadow-lg shadow-black/40";

  return (
    <header className="site-bar pointer-events-none fixed inset-x-3 top-3 z-30 flex items-center justify-between gap-3">
      <Link
        href="/"
        className={cn(pill, "hidden px-4 py-2 font-display text-sm tracking-wide sm:block")}
      >
        {profile.name}
      </Link>
      <nav
        ref={navRef}
        aria-label="Primary"
        // The soft fade at both ends tells narrow-phone visitors the tab bar scrolls.
        className={cn(
          pill,
          "studio-scroll-hide flex max-w-full items-center gap-1 overflow-x-auto p-1 sm:ml-auto",
          "max-sm:[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]"
        )}
      >
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors sm:px-4 sm:text-[13px]",
                active
                  ? "bg-[var(--green)] text-white"
                  : "text-[var(--ink-dim)] hover:text-white"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
