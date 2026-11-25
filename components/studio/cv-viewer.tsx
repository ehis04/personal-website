"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CvHotspot, cvHotspots, cvLinks, cvPages } from "@/config/cv";
import { degrees, experiences, skillGroups, studioProjects } from "@/config/studio";

const spring = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;

interface Detail {
  kicker: string;
  title: string;
  meta?: string;
  summary?: string;
  bullets: string[];
  tags: string[];
  metrics?: { value: string; label: string }[];
  groups?: { group: string; items: string[] }[];
  links: { label: string; href: string; external?: boolean }[];
}

/** Everything shown for a region comes from config/studio.ts, so the CV never drifts from the site. */
function detailFor(h: CvHotspot): Detail | null {
  const extra = cvLinks[h.ref] ?? [];
  if (h.kind === "experience") {
    const e = experiences.find((x) => x.id === h.ref);
    if (!e) return null;
    return {
      kicker: e.role,
      title: e.company,
      meta: `${e.period} · ${e.location}`,
      summary: e.summary,
      bullets: e.highlights,
      tags: e.tags,
      metrics: e.metrics,
      links: extra,
    };
  }
  if (h.kind === "project") {
    const p = studioProjects.find((x) => x.id === h.ref);
    if (!p) return null;
    return {
      kicker: p.kicker,
      title: p.title,
      meta: p.status,
      summary: p.summary,
      bullets: p.highlights,
      tags: p.tags,
      metrics: p.metrics,
      links: [...(p.repo ? [{ label: "View on GitHub", href: p.repo, external: true }] : []), ...extra],
    };
  }
  if (h.kind === "education") {
    const d = degrees.find((x) => x.id === h.ref);
    if (!d) return null;
    return {
      kicker: "Education",
      title: d.degree,
      meta: `${d.school} · ${d.city} · ${d.period}`,
      bullets: d.note ? [d.note] : [],
      tags: [],
      links: extra,
    };
  }
  return {
    kicker: "Technical skills",
    title: "Skills & tools",
    bullets: [],
    tags: [],
    groups: skillGroups,
    links: extra,
  };
}

export function CvViewer() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = cvHotspots.find((h) => h.id === openId) ?? null;

  const close = useCallback(() => {
    const id = openId;
    setOpenId(null);
    if (id) setTimeout(() => document.querySelector<HTMLElement>(`[data-cv="${id}"]`)?.focus(), 450);
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.dialog = "open"; // hides the top bars (see studio.css)
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      delete document.body.dataset.dialog;
    };
  }, [openId, close]);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {cvPages.map((src, i) => (
          <div
            key={src}
            className="recess relative bg-white"
            style={{ aspectRatio: "595.276 / 841.89", borderRadius: 18 }}
          >
            <Image
              src={src}
              alt={`Curriculum vitae, page ${i + 1} of ${cvPages.length}`}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="select-none object-contain"
              draggable={false}
            />
            {cvHotspots
              .filter((h) => h.page === i + 1 && h.id !== openId)
              .map((h) => (
                <motion.button
                  key={h.id}
                  layoutId={`cv-${h.id}`}
                  transition={spring}
                  onClick={() => setOpenId(h.id)}
                  data-cv={h.id}
                  aria-label={`Open details: ${detailFor(h)?.title ?? h.id}`}
                  className="cv-hotspot group absolute rounded-lg text-left outline-none"
                  style={{
                    left: `${h.rect.x}%`,
                    top: `${h.rect.y}%`,
                    width: `${h.rect.w}%`,
                    height: `${h.rect.h}%`,
                  }}
                >
                  <span className="absolute right-0 top-0 grid h-5 w-5 -translate-y-1/3 translate-x-1/3 place-items-center rounded-full bg-[#2f7d50] text-white opacity-80 shadow transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Plus className="h-3 w-3" />
                  </span>
                </motion.button>
              ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="dim"
              className="fixed inset-0 z-40 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
            />
            <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-3 md:p-8">
              <Expanded hotspot={open} onClose={close} />
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Expanded({ hotspot, onClose }: { hotspot: CvHotspot; onClose: () => void }) {
  const d = detailFor(hotspot);
  if (!d) return null;
  return (
    <motion.div
      layoutId={`cv-${hotspot.id}`}
      transition={spring}
      role="dialog"
      aria-modal="true"
      aria-label={d.title}
      className="recess pointer-events-auto relative max-h-[88svh] w-full max-w-3xl overflow-hidden"
      style={{ borderRadius: 26 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
        className="flex max-h-[88svh] flex-col overflow-y-auto bg-[#0c110f]/95 p-7 md:p-10"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">{d.kicker}</p>
        <h2 className="mt-2 pr-10 font-display text-3xl md:text-5xl">{d.title}</h2>
        {d.meta && <p className="mt-2 text-sm text-[var(--ink-dim)]">{d.meta}</p>}
        {d.summary && <p className="mt-5 text-lg text-white/90">{d.summary}</p>}

        {d.bullets.length > 0 && (
          <ul className="mt-5 space-y-3 text-[15px] text-white/80">
            {d.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green-glow)]" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {d.groups && (
          <div className="mt-5 space-y-4">
            {d.groups.map((g) => (
              <div key={g.group}>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--ink-dim)]">{g.group}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span key={t} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {d.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {d.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                {t}
              </span>
            ))}
          </div>
        )}

        {d.metrics && d.metrics.length > 0 && (
          <div
            className="mt-6 grid gap-3 text-center"
            style={{ gridTemplateColumns: `repeat(${d.metrics.length}, minmax(0, 1fr))` }}
          >
            {d.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-[var(--surface-2)] px-3 py-4 ring-1 ring-white/5">
                <p className="font-display text-2xl text-[var(--green-glow)]">{m.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {d.links.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {d.links.map((l, i) =>
              l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--green-glow)]"
                >
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  key={l.href + l.label}
                  href={l.href}
                  className={
                    i === 0 && !d.links.some((x) => x.external)
                      ? "inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--green-glow)]"
                      : "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10"
                  }
                >
                  {l.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
              )
            )}
          </div>
        )}
      </motion.div>

      <button
        onClick={onClose}
        autoFocus
        aria-label="Close"
        className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/60 ring-1 ring-white/15 transition-colors hover:bg-black/80"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
