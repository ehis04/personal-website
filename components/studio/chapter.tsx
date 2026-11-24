import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { AnimatedHeading } from "./animated-heading";
import { Screen } from "./scroller";

interface ChapterProps {
  index: number;
  kicker: string;
  /** Wrap a word in *asterisks* to set it in the serif accent face. */
  title: string;
  href: string;
  cta: string;
  /** Tailwind grid-rows class for desktop, e.g. "lg:grid-rows-[3fr_2fr]". */
  rows?: string;
  children: React.ReactNode;
}

/** One full-screen section of the home page: a title row plus a bento of tiles. */
export function Chapter({
  index,
  kicker,
  title,
  href,
  cta,
  rows = "lg:grid-rows-2",
  children,
}: ChapterProps) {
  return (
    <Screen>
      <div className="h-full px-3 pb-3 pt-[3.75rem]">
        <div
          className="recess sheet flex h-full flex-col gap-3 bg-[#0c110f] p-3"
          style={{ borderRadius: 28 }}
        >
          <header className="flex items-end justify-between gap-4 px-3 pt-2">
            <div>
              <p className="legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]">
                {String(index).padStart(2, "0")} · {kicker}
              </p>
              <AnimatedHeading
                as="h2"
                text={title}
                wordClassName="text-sheen"
                className="font-display mt-1 text-4xl leading-[0.95] md:text-6xl"
              />
            </div>
            <Link
              href={href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2f7d50] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#46b07a]"
            >
              {cta} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </header>
          <div className={`grid min-h-0 flex-1 grid-cols-12 gap-3 ${rows}`}>{children}</div>
        </div>
      </div>
    </Screen>
  );
}
