"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ID = /^[\w-]{11}$/;

/**
 * A YouTube "facade": shows a still and a play button, and only loads the real
 * player (about 500 KB of third-party code) after the visitor clicks. That keeps
 * a page of videos fast on phones.
 */
export function LiteYouTube({
  title,
  poster,
  youtubeId,
}: {
  title: string;
  poster: string;
  youtubeId?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const valid = !!youtubeId && ID.test(youtubeId);

  if (loaded && valid) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => valid && setLoaded(true)}
      disabled={!valid}
      aria-label={valid ? `Play ${title}` : `${title} (video coming soon)`}
      className="group absolute inset-0 block h-full w-full text-left disabled:cursor-default"
    >
      <Image
        src={poster}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
      <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#2f7d50] shadow-xl shadow-black/50 transition-transform group-hover:scale-110">
        <Play className="h-5 w-5 fill-current" />
      </span>
      {!valid && (
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white/80 ring-1 ring-white/10">
          Coming soon
        </span>
      )}
    </button>
  );
}
