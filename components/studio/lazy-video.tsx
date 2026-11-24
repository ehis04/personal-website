"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Only a couple of clips may play at once. The oldest is paused first, so a
// page full of videos never decodes more than MAX_PLAYING streams.
const MAX_PLAYING = 2;
const playingNow: HTMLVideoElement[] = [];

function claim(video: HTMLVideoElement) {
  if (playingNow.includes(video)) return;
  while (playingNow.length >= MAX_PLAYING) {
    playingNow.shift()?.pause();
  }
  playingNow.push(video);
}

function release(video: HTMLVideoElement) {
  const i = playingNow.indexOf(video);
  if (i > -1) playingNow.splice(i, 1);
}

interface LazyVideoProps {
  src: string;
  poster: string;
  className?: string;
  /** If given, overrides the scroll-into-view behaviour (e.g. "is the active slide"). */
  playing?: boolean;
}

/**
 * A muted looping clip that costs almost nothing until it is wanted:
 *  - the poster is a natively lazy <img>, so off-screen posters are not fetched;
 *  - the video file is requested only once the clip is visible, and then only
 *    when the browser is idle, so it never competes with the first paint;
 *  - skipped entirely for reduced-motion or data-saver visitors.
 */
export function LazyVideo({ src, poster, className, playing }: LazyVideoProps) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const allowed = useRef(true);
  const [inView, setInView] = useState(false);
  const [shown, setShown] = useState(false); // video has frames: fade it over the poster

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    allowed.current =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !conn?.saveData;
  }, []);

  // Track visibility (unused when `playing` is controlled by the parent).
  useEffect(() => {
    const el = root.current;
    if (!el || playing !== undefined) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [playing]);

  const want = playing ?? inView;

  useEffect(() => {
    const video = ref.current;
    if (!video || !allowed.current) return;
    if (!want) {
      video.pause();
      release(video);
      return;
    }
    const start = () => {
      // The file is only requested the first time the clip is actually wanted.
      if (!video.getAttribute("src")) video.src = src;
      claim(video);
      video.play().catch(() => {});
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (h: number) => void;
    };
    const useIdle = typeof w.requestIdleCallback === "function";
    const handle = useIdle
      ? w.requestIdleCallback!(start, { timeout: 1200 })
      : window.setTimeout(start, 300);
    return () => {
      if (useIdle) w.cancelIdleCallback?.(handle);
      else clearTimeout(handle);
      release(video);
    };
  }, [want, src]);

  return (
    <div ref={root} className={cn("overflow-hidden", className)} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setShown(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
          shown ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
