"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { studioProjects } from "@/config/studio";
import { cn } from "@/lib/utils";

import { LazyVideo } from "./lazy-video";

export function ProjectStrip() {
  const scroller = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const frame = useRef(0);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  // The "focus" travels across the strip as you scroll: at the start it sits on
  // the first pill, at the end on the last, so the pills always fill the screen
  // (no empty padding) and every pill can become the active one.
  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const s = scroller.current;
      const first = items.current[0];
      if (!s || !first) return;
      const max = s.scrollWidth - s.clientWidth;
      const pw = first.offsetWidth;
      const progress = max > 0 ? s.scrollLeft / max : 0;
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

  // Scroll so that pill i sits under the focus (inverse of the formula above).
  const goTo = useCallback((i: number) => {
    const s = scroller.current;
    const el = items.current[i];
    if (!s || !el) return;
    const max = s.scrollWidth - s.clientWidth;
    const pw = el.offsetWidth;
    const k = max > 0 ? 1 + (s.clientWidth - pw) / max : 1;
    s.scrollTo({ left: (el.offsetLeft + pw / 2 - pw / 2) / k, behavior: "smooth" });
  }, []);

  const step = (d: number) =>
    goTo(Math.min(studioProjects.length - 1, Math.max(0, active + d)));

  const project = studioProjects[active];

  return (
    <section aria-label="Projects" className="pt-24">
      <div className="mb-5 flex items-end justify-between px-4 md:px-8">
        <h1 className="font-display text-5xl leading-none md:text-7xl">Projects</h1>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)] sm:block">
            Drag or swipe · {active + 1} / {studioProjects.length}
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

      <div
        ref={scroller}
        onScroll={onScroll}
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
        style={{ "--pw": "min(72vw, 300px)" } as React.CSSProperties}
        className={cn(
          "studio-scroll-hide relative flex items-center gap-4 overflow-x-auto px-4 py-4",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {studioProjects.map((p, i) => {
          const isActive = i === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                items.current[i] = el;
              }}
              onClick={() => {
                if (drag.current.moved) return;
                goTo(i);
              }}
              aria-label={p.title}
              aria-current={isActive}
              className={cn(
                "recess relative h-[min(60svh,580px)] w-[var(--pw)] shrink-0 select-none transition-transform duration-500 ease-out",
                isActive ? "scale-100" : "scale-[0.92]"
              )}
              style={{
                borderRadius: 9999,
                boxShadow: isActive
                  ? "0 0 0 2px var(--green), 0 30px 60px -20px rgba(47,125,80,.45)"
                  : undefined,
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 transition-[filter] duration-500",
                  isActive ? "" : "grayscale brightness-[0.45]"
                )}
              >
                {p.media.kind === "video" ? (
                  <LazyVideo
                    src={p.media.src}
                    poster={p.media.poster}
                    playing={isActive}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <Image
                    src={p.media.src}
                    alt=""
                    fill
                    sizes="300px"
                    draggable={false}
                    className="object-cover"
                    style={{ objectPosition: p.media.position }}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
              <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-14 text-center">
                <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--green-glow)]">
                  {p.kicker}
                </span>
                <span className="mt-2 font-display text-2xl leading-tight uppercase">{p.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-2 grid max-w-6xl gap-3 px-3 pb-12 md:grid-cols-[1.4fr_1fr]">
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="contents"
          >
            <div className="recess bg-[var(--surface-2)] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">
                {project.kicker}
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl">{project.title}</h2>
              <p className="mt-3 max-w-xl text-[15px] text-white/80">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span key={t} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="recess flex flex-col justify-between bg-gradient-to-br from-[#123a26]/80 to-[var(--surface-2)] p-6 md:p-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">When</p>
                <p className="font-display text-2xl">{project.status}</p>
                <p className="mt-2 text-xs text-white/60">Live demo coming soon</p>
              </div>
              {project.repo ? (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--green-glow)]"
                >
                  View on GitHub <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="mt-6 inline-flex w-fit items-center rounded-full px-5 py-2.5 text-sm text-white/70 ring-1 ring-white/20">
                  Code not public yet
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
