"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { StudioProject, studioProjects } from "@/config/studio";
import { cn } from "@/lib/utils";

import { trapTab } from "./dialog-utils";
import { DialogPortal } from "./dialog-portal";
import { LazyVideo } from "./lazy-video";

const spring = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;
// Constant radius (not 9999) so the card-to-dialog morph animates a sane number.
const PILL_RADIUS = 150;
const DIALOG_RADIUS = 26;

export function ProjectStrip() {
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const frame = useRef(0);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const slider = useRef<HTMLInputElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  // The slider above the strip mirrors the strip's scroll position and also drives it.
  const syncSlider = useCallback(() => {
    const s = scroller.current;
    const sl = slider.current;
    if (!s || !sl) return;
    const max = s.scrollWidth - s.clientWidth;
    sl.value = String(max > 0 ? Math.round((s.scrollLeft / max) * 1000) : 0);
  }, []);

  // Show the slider only when there are more projects than fit on screen.
  useEffect(() => {
    const s = scroller.current;
    if (!s) return;
    // The observer reports once as soon as it starts watching, so no separate first check is needed.
    const ro = new ResizeObserver(() => setOverflowing(s.scrollWidth - s.clientWidth > 4));
    ro.observe(s);
    return () => ro.disconnect();
  }, []);
  useEffect(() => syncSlider(), [overflowing, syncSlider]);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = studioProjects.find((p) => p.id === openId) ?? null;

  // The "focus" travels across the strip as you scroll: at the start it sits on
  // the first card, at the end on the last, so every card can become the active one.
  // When every card already fits on screen there is nothing to scroll and hover
  // (or the arrow keys) picks the active card instead.
  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const s = scroller.current;
      const first = items.current[0];
      if (!s || !first) return;
      const max = s.scrollWidth - s.clientWidth;
      if (max <= 0) return;
      const pw = first.offsetWidth;
      const progress = s.scrollLeft / max;
      const focus = s.scrollLeft + pw / 2 + progress * (s.clientWidth - pw);
      let best = 0;
      let bestDist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - focus);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    });
  }, []);

  // Scroll so that card i sits under the focus (inverse of the formula above).
  const goTo = useCallback((i: number) => {
    const s = scroller.current;
    const el = items.current[i];
    if (!s || !el) return;
    const max = s.scrollWidth - s.clientWidth;
    setActive(i);
    if (max <= 0) return;
    const pw = el.offsetWidth;
    const k = 1 + (s.clientWidth - pw) / max;
    s.scrollTo({ left: el.offsetLeft / k, behavior: "smooth" });
  }, []);

  const step = (d: number) => goTo(Math.min(studioProjects.length - 1, Math.max(0, active + d)));

  const close = useCallback(() => {
    const id = openId;
    setOpenId(null);
    // Give focus back to the card that opened the dialog (it re-mounts after close).
    if (id) setTimeout(() => document.querySelector<HTMLElement>(`[data-card="${id}"]`)?.focus(), 450);
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else trapTab(e);
    };
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
    <section aria-label="Projects" className="pb-14 pt-24">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 px-4 md:px-8">
        <div>
          <h1 className="font-display text-5xl leading-none md:text-7xl">Projects</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-white/75">
            Investigate the public projects in more detail. Open any card for the full write-up, the tech stack and
            the code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)] sm:block">
            Tap a project to open · {active + 1} / {studioProjects.length}
          </p>
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => step(d)}
              aria-label={d < 0 ? "Previous project" : "Next project"}
              className="grid h-10 w-10 place-items-center rounded-full bg-black/50 ring-1 ring-white/15 transition-colors hover:bg-[var(--green)]"
            >
              {d < 0 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {overflowing && (
        <div className="px-4 pb-1 md:px-8">
          <input
            ref={slider}
            type="range"
            min={0}
            max={1000}
            step={1}
            defaultValue={0}
            aria-label="Slide through the projects"
            onChange={(e) => {
              const s = scroller.current;
              if (!s) return;
              s.scrollLeft = (Number(e.target.value) / 1000) * (s.scrollWidth - s.clientWidth);
            }}
            className="proj-slider"
          />
        </div>
      )}

      <div
        ref={scroller}
        onScroll={() => {
          onScroll();
          syncSlider();
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !scroller.current) return;
          drag.current = { down: true, x: e.clientX, left: scroller.current.scrollLeft, moved: false };
          setDragging(true);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down || !scroller.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 5) d.moved = true;
          scroller.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          drag.current.down = false;
          setDragging(false);
        }}
        onPointerLeave={() => {
          drag.current.down = false;
          setDragging(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className={cn(
          "proj-strip studio-scroll-hide relative flex items-center gap-4 overflow-x-auto px-4 py-4",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {studioProjects.map((p, i) => (
          // The wrapper keeps the card's slot reserved while it is expanded.
          <div
            key={p.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse" && !drag.current.down) setActive(i);
            }}
            className="h-[clamp(460px,calc(100svh-14rem),720px)] w-[var(--pw)] shrink-0"
          >
            {openId !== p.id && (
              <Card
                project={p}
                active={i === active}
                eager={i === 0}
                onOpen={() => {
                  if (drag.current.moved) return;
                  setActive(i);
                  setOpenId(p.id);
                }}
              />
            )}
          </div>
        ))}
      </div>

      <DialogPortal>
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
              <Expanded project={open} onClose={close} />
            </div>
          </>
        )}
      </AnimatePresence>
      </DialogPortal>
    </section>
  );
}

function Card({
  project: p,
  active,
  onOpen,
  eager,
}: {
  project: StudioProject;
  active: boolean;
  onOpen: () => void;
  eager?: boolean;
}) {
  return (
    <motion.button
      layoutId={`proj-${p.id}`}
      transition={spring}
      onClick={onOpen}
      aria-current={active}
      data-card={p.id}
      className="recess relative h-full w-full select-none text-left"
      style={{
        borderRadius: PILL_RADIUS,
        boxShadow: active ? "0 0 0 2px var(--green), 0 30px 60px -20px rgba(47,125,80,.45)" : undefined,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 transition-[filter] duration-500",
          active ? "" : "grayscale brightness-[0.45]"
        )}
      >
        {p.media.kind === "video" ? (
          <LazyVideo
            src={p.media.src}
            poster={p.media.poster}
            playing={active}
            eager={eager}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <Image
            src={p.media.src}
            alt=""
            fill
            priority={eager}
            sizes="400px"
            draggable={false}
            className="object-cover"
            style={{ objectPosition: p.media.position }}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-7 pb-14 text-center">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--green-glow)]">{p.kicker}</span>
        <span className="mt-2 font-display text-2xl leading-tight uppercase">{p.title}</span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/60">{p.status}</span>
        <span className="mt-3 line-clamp-4 text-[13px] leading-snug text-white/80">{p.summary}</span>
        <span
          className={cn(
            "mt-3 text-[11px] uppercase tracking-[0.18em] text-[var(--green-glow)] transition-opacity",
            active ? "opacity-100" : "opacity-0"
          )}
        >
          Read more →
        </span>
      </div>
    </motion.button>
  );
}

function Expanded({ project: p, onClose }: { project: StudioProject; onClose: () => void }) {
  // Show the still poster while the card animates open, then start the clip.
  // Decoding video mid-animation is what causes dropped frames on slow devices.
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      layoutId={`proj-${p.id}`}
      transition={spring}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      className="recess pointer-events-auto relative h-full max-h-[880px] w-full max-w-6xl"
      style={{ borderRadius: DIALOG_RADIUS }}
    >
      <div className="grid h-full md:grid-cols-[5fr_7fr]">
        <div className="relative hidden overflow-hidden md:block" style={{ borderRadius: DIALOG_RADIUS }}>
          {p.media.kind === "video" && videoReady ? (
            <LazyVideo src={p.media.src} poster={p.media.poster} playing className="absolute inset-0 h-full w-full" />
          ) : (
            <Image
              src={p.media.kind === "video" ? p.media.poster : p.media.src}
              alt=""
              fill
              sizes="500px"
              className="object-cover"
              style={{ objectPosition: p.media.kind === "image" ? p.media.position : undefined }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="absolute bottom-0 left-0 p-7"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-white/75">{p.status}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="relative flex flex-col overflow-y-auto bg-[#0c110f]/95 p-7 md:p-10"
        >
          <p className="pr-12 text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">{p.kicker}</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">{p.title}</h2>
          <p className="mt-1 text-sm text-[var(--ink-dim)] md:hidden">{p.status}</p>
          <p className="mt-6 text-lg text-white/90">{p.summary}</p>
          <ul className="mt-6 space-y-3 text-[15px] text-white/80">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green-glow)]" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                {t}
              </span>
            ))}
          </div>

          {p.metrics && p.metrics.length > 0 && (
            <div
              className="mt-8 grid gap-3 text-center"
              style={{ gridTemplateColumns: `repeat(${p.metrics.length}, minmax(0, 1fr))` }}
            >
              {p.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-[var(--surface-2)] px-3 py-4 ring-1 ring-white/5">
                  <p className="font-display text-2xl text-[var(--green-glow)]">{m.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {!p.demoUrl && (
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-black/20 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#2f7d50]/25 text-[var(--green-glow)]">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className="font-display text-lg leading-tight">Interactive demo coming soon</p>
                <p className="mt-1 text-xs text-white/60">
                  A hands-on version of this project will appear here once it is hosted.
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            {p.demoUrl && (
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--green-glow)]"
              >
                Launch live demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {p.repo ? (
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  p.demoUrl
                    ? "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10"
                    : "inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--green-glow)]"
                }
              >
                View on GitHub <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center rounded-full px-5 py-2.5 text-sm text-white/70 ring-1 ring-white/20">
                Code not public yet
              </span>
            )}
          </div>
        </motion.div>
      </div>

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
