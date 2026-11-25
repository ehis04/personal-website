import Link from "next/link";

import { platforms } from "@/config/platforms";
import { contactEmail, navLinks } from "@/config/site";
import { profile } from "@/config/studio";

const github = platforms.find((p) => p.id === "github")?.url;
const year = new Date().getFullYear();

const linkClass = "text-[var(--ink-dim)] transition-colors hover:text-white";

/**
 * Site footer. The full version closes every page; the compact one-line version
 * sits inside the last screen of the home page (which is a fixed-height scroller).
 */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-3 pb-1 pt-1 text-xs text-[var(--ink-dim)]">
        <p>
          © {year} {profile.name} · {profile.mainRole}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
          {navLinks
            .filter((l) => l.href !== "/")
            .map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>
                {l.label}
              </Link>
            ))}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub
            </a>
          )}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className={linkClass}>
              Email
            </a>
          )}
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
        </nav>
      </footer>
    );
  }

  return (
    <footer className="site-footer mx-auto max-w-[1600px] px-3 pb-3 pt-10">
      <div className="recess bg-[#0c110f] p-6 md:p-10" style={{ borderRadius: 28 }}>
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl md:text-4xl">{profile.name}</p>
            <p className="mt-2 max-w-sm text-sm text-white/70">
              {profile.mainRole}. Football analytics, NLP research and full-stack products.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">Explore</p>
            <ul className="mt-3 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">Elsewhere</p>
            <ul className="mt-3 space-y-2 text-sm">
              {contactEmail && (
                <li>
                  <a href={`mailto:${contactEmail}`} className={linkClass}>
                    Email me
                  </a>
                </li>
              )}
              {github && (
                <li>
                  <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    GitHub
                  </a>
                </li>
              )}
              <li>
                <Link href="/platforms" className={linkClass}>
                  All platforms
                </Link>
              </li>
              <li>
                <Link href="/ask" className={linkClass}>
                  Ask the assistant
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-5 text-xs text-[var(--ink-dim)]">
          <p>
            © {year} {profile.name}
          </p>
          <p>
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            {" · "}Built with Next.js · Hosted on Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
}
