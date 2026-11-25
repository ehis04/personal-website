"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { Experience, experiences } from "@/config/studio";

import { trapTab } from "./dialog-utils";
import { DialogPortal } from "./dialog-portal";
import { LazyVideo } from "./lazy-video";

// Placeholder gallery; each role will list its own photos and clips.
const gallery = ["/media/photo-5.jpg", "/media/photo-3.jpg", "/media/photo-1.jpg"];

const spring = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 } as const;

function Monogram({ name }: { name: string }) {
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--green)] font-display text-sm text-white ring-1 ring-white/20">
      {name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function ExperienceStack() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = experiences.find((e) => e.id === openId) ?? null;
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
    <>
      <div className="mx-auto max-w-6xl px-3 pb-[4svh] pt-24">
        <div className="mb-6 flex items-end justify-between px-1">
          <h1 className="font-display text-5xl leading-none md:text-7xl">Experience</h1>
          <p className="hidden text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)] sm:block">
            Scroll to stack · tap to open
          </p>
        </div>
        {experiences.map((e, i) => (
          // Each wrapper sticks a little lower than the last, so later cards
          // slide over earlier ones and only each header strip stays visible.
          <div
            key={e.id}
            className="sticky mb-[7svh] h-[62svh] min-h-[400px]"
            style={{ top: `calc(4.5rem + ${i * 3.4}rem)`, zIndex: i + 1 }}
          >
            {openId !== e.id && <Card exp={e} first={i === 0} onOpen={() => setOpenId(e.id)} />}
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
              <Expanded exp={open} onClose={close} />
            </div>
          </>
        )}
      </AnimatePresence>
      </DialogPortal>
    </>
  );
}

function Card({ exp, onOpen, first }: { exp: Experience; onOpen: () => void; first?: boolean }) {
  return (
    <motion.button
      layoutId={`card-${exp.id}`}
      transition={spring}
      onClick={onOpen}
      data-card={exp.id}
      className="recess sheet group relative h-full w-full text-left"
      style={{ borderRadius: 26 }}
    >
      {exp.video ? (
        <LazyVideo src={exp.video.src} poster={exp.video.poster} className="absolute inset-0 h-full w-full" />
      ) : (
        <Image
          src={exp.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 1000px, 100vw"
          priority={first}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition: exp.imagePosition }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-black/85" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex h-[3.4rem] items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <Monogram name={exp.company} />
            <div className="leading-tight">
              <p className="font-display text-base">{exp.company}</p>
              <p className="text-xs text-white/70">{exp.role}</p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/70">{exp.period}</p>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
          <div className="max-w-xl">
            <p className="text-base text-white/90 md:text-lg">{exp.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--green-glow)]">
              Read the full story →
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {exp.tags.map((t) => (
              <span key={t} className="rounded-full bg-black/50 px-3 py-1 text-xs ring-1 ring-white/15">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function Expanded({ exp, onClose }: { exp: Experience; onClose: () => void }) {
  return (
    <motion.div
      layoutId={`card-${exp.id}`}
      transition={spring}
      role="dialog"
      aria-modal="true"
      aria-label={exp.company}
      className="recess pointer-events-auto relative h-full max-h-[880px] w-full max-w-6xl"
      style={{ borderRadius: 26 }}
    >
      <div className="grid h-full md:grid-cols-[5fr_7fr]">
        <div className="relative hidden md:block">
          {exp.video ? (
            <LazyVideo src={exp.video.src} poster={exp.video.poster} playing className="absolute inset-0 h-full w-full" />
          ) : (
            <Image
              src={exp.image}
              alt=""
              fill
              sizes="500px"
              className="object-cover"
              style={{ objectPosition: exp.imagePosition }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="absolute bottom-0 left-0 p-7"
          >
            <Monogram name={exp.company} />
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/70">
              {exp.period} · {exp.location}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.28, duration: 0.4 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="relative flex flex-col overflow-y-auto bg-[#0c110f]/95 p-7 md:p-10"
        >
          <p className="pr-12 text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">
            {exp.role}
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">{exp.company}</h2>
          <p className="mt-1 text-sm text-[var(--ink-dim)] md:hidden">
            {exp.period} · {exp.location}
          </p>
          <p className="mt-6 text-lg text-white/90">{exp.summary}</p>
          <ul className="mt-6 space-y-3 text-[15px] text-white/80">
            {exp.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green-glow)]" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-2">
            {exp.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                {t}
              </span>
            ))}
          </div>

          {exp.metrics && exp.metrics.length > 0 && (
            <div
              className="mt-8 grid gap-3 text-center"
              style={{ gridTemplateColumns: `repeat(${exp.metrics.length}, minmax(0, 1fr))` }}
            >
              {exp.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl bg-[var(--surface-2)] px-3 py-4 ring-1 ring-white/5">
                  <p className="font-display text-2xl text-[var(--green-glow)]">{m.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-[var(--ink-dim)]">Gallery</p>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((src) => (
                <div key={src} className="recess relative aspect-[4/3]" style={{ borderRadius: 16 }}>
                  <Image src={src} alt="" fill sizes="220px" className="object-cover" />
                </div>
              ))}
            </div>
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
