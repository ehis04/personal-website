import Image from "next/image";
import Link from "next/link";

import { StudioMedia } from "@/config/studio";
import { cn } from "@/lib/utils";

import { LazyVideo } from "./lazy-video";

interface TileProps {
  href?: string;
  media?: StudioMedia;
  alt?: string;
  sizes?: string;
  className?: string;
  children?: React.ReactNode;
  /** Darken the lower part of the media so overlaid text stays readable. */
  scrim?: boolean;
  priority?: boolean;
}

/**
 * A recessed "window" in the page. This is a server component with no
 * client-side scroll code: the media's parallax drift is a CSS scroll-driven
 * animation (see `.parallax` in studio.css), so it costs no JavaScript.
 */
export function Tile({
  href,
  media,
  alt = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  className,
  children,
  scrim = true,
  priority,
}: TileProps) {
  const inner = (
    <>
      {media && (
        <>
          <div className="parallax absolute inset-x-0 -inset-y-[9%]">
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04]">
              {media.kind === "image" ? (
                <Image
                  src={media.src}
                  alt={alt}
                  fill
                  sizes={sizes}
                  priority={priority}
                  className="object-cover"
                  style={{ objectPosition: media.position }}
                />
              ) : (
                <LazyVideo
                  src={media.src}
                  poster={media.poster}
                  className="absolute inset-0 h-full w-full"
                />
              )}
            </div>
          </div>
          {scrim && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
          )}
        </>
      )}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </>
  );

  const classes = cn("recess reveal group block", className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <section className={classes}>{inner}</section>;
}
