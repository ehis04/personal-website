"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type ScrollerRef = React.RefObject<HTMLDivElement | null>;
const ScrollerContext = createContext<ScrollerRef | null>(null);

/** The scroll container a component lives in (null when the page itself scrolls). */
export function useScrollerRef() {
  return useContext(ScrollerContext);
}

/**
 * A full-screen "page by page" scroller. Each <Screen> snaps into place, so one
 * wheel tick, swipe or key press moves to the next section and it fills the
 * display. Native CSS scroll-snap does the snapping (no scroll hijacking), which
 * keeps it smooth on phones.
 */
export function Scroller({
  labels,
  children,
}: {
  labels: string[];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);

  // Focus the scroller so arrow keys / PageDown / Space work immediately.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const screens = () =>
    Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-screen]") ?? []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const s = ref.current;
      if (!s) return;
      const mid = s.scrollTop + s.clientHeight / 2;
      let idx = 0;
      Array.from(s.querySelectorAll<HTMLElement>("[data-screen]")).forEach((el, i) => {
        if (el.offsetTop <= mid) idx = i;
      });
      setActive(idx);
    });
  }, []);

  const go = (i: number) =>
    screens()[i]?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Desktop: one wheel gesture (or trackpad swipe) moves exactly one section.
  // Native snapping alone can fall back to the same screen after a light flick,
  // so on roomy displays we step explicitly. Touch and short screens keep the
  // browser's own scrolling.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const roomy = window.matchMedia("(min-width: 1024px) and (min-height: 761px)");
    const state = { until: 0, last: 0, armed: true };

    const onWheel = (e: WheelEvent) => {
      if (!roomy.matches) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - state.last;
      state.last = now;
      if (now < state.until) return;
      // After a step, wait for a pause so trackpad inertia can't trigger another.
      if (!state.armed) {
        if (gap < 140) return;
        state.armed = true;
      }
      if (Math.abs(e.deltaY) < 4) return;
      const list = Array.from(el.querySelectorAll<HTMLElement>("[data-screen]"));
      const mid = el.scrollTop + el.clientHeight / 2;
      let current = 0;
      list.forEach((s, i) => {
        if (s.offsetTop <= mid) current = i;
      });
      const next = Math.min(list.length - 1, Math.max(0, current + (e.deltaY > 0 ? 1 : -1)));
      if (next === current) return;
      state.armed = false;
      state.until = now + 750;
      list[next].scrollIntoView({ behavior: "smooth", block: "start" });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <ScrollerContext.Provider value={ref}>
      <div
        ref={ref}
        tabIndex={-1}
        onScroll={onScroll}
        className={cn(
          "home-scroller studio-scroll-hide relative h-svh overflow-y-auto overscroll-contain outline-none",
          "snap-y snap-proximity lg:snap-mandatory",
          "[@media(max-height:760px)]:snap-proximity"
        )}
      >
        {children}
      </div>

      <nav
        aria-label="Sections"
        className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => go(i)}
            aria-label={`Go to ${label}`}
            aria-current={i === active}
            className="group flex items-center gap-3"
          >
            <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white/80 opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {label}
            </span>
            <span
              className={cn(
                "block w-1.5 rounded-full transition-all duration-300",
                i === active ? "h-7 bg-[#46b07a]" : "h-1.5 bg-white/35 group-hover:bg-white/70"
              )}
            />
          </button>
        ))}
      </nav>
    </ScrollerContext.Provider>
  );
}

/**
 * One full-screen section. The rise/scale/fade as it scrolls into view is a CSS
 * scroll-driven animation (`.screen-inner` in studio.css, no JavaScript per
 * frame); this component only flags when the section is on screen so its tiles
 * can reveal one after another (`data-active`).
 */
export function Screen({
  children,
  className,
  first,
}: {
  children: React.ReactNode;
  className?: string;
  /** The opening screen: visible in the server HTML and animated by CSS on load. */
  first?: boolean;
}) {
  const container = useScrollerRef();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(!!first);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      root: container?.current ?? null,
      rootMargin: "-20% 0px -20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [container]);

  return (
    <section
      ref={ref}
      data-screen
      data-active={active}
      data-first={first ? "" : undefined}
      className={cn(
        "screen relative snap-start overflow-hidden",
        "min-h-svh lg:h-svh [@media(max-height:760px)]:h-auto",
        className
      )}
    >
      <div className="screen-inner h-full">{children}</div>
    </section>
  );
}
