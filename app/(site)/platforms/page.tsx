import type { IconType } from "react-icons";
import {
  SiBluesky,
  SiCalendly,
  SiDevpost,
  SiDiscord,
  SiFacebook,
  SiGithub,
  SiGooglescholar,
  SiHackerrank,
  SiHuggingface,
  SiInstagram,
  SiKaggle,
  SiLeetcode,
  SiLinkedin,
  SiMedium,
  SiOrcid,
  SiResearchgate,
  SiSpotify,
  SiStackoverflow,
  SiSubstack,
  SiThreads,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { ArrowUpRight } from "lucide-react";

import { AnimatedHeading } from "@/components/studio/animated-heading";
import { Tile } from "@/components/studio/tile";
import { Platform, platforms } from "@/config/platforms";
import { cn } from "@/lib/utils";

export const metadata = { title: "Platforms", alternates: { canonical: "/platforms" } };

const icons: Record<string, IconType> = {
  linkedin: SiLinkedin,
  x: SiX,
  substack: SiSubstack,
  facebook: SiFacebook,
  leetcode: SiLeetcode,
  github: SiGithub,
  calendly: SiCalendly,
  medium: SiMedium,
  youtube: SiYoutube,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  threads: SiThreads,
  bluesky: SiBluesky,
  kaggle: SiKaggle,
  huggingface: SiHuggingface,
  stackoverflow: SiStackoverflow,
  hackerrank: SiHackerrank,
  devpost: SiDevpost,
  scholar: SiGooglescholar,
  orcid: SiOrcid,
  researchgate: SiResearchgate,
  discord: SiDiscord,
  spotify: SiSpotify,
};

const eyebrow = "legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]";

// The five main places, in this order. Everything else goes under "More places".
const mainIds = ["linkedin", "youtube", "github", "substack", "x"];

function Card({ p, big, span }: { p: Platform; big?: boolean; span: string }) {
  const Icon = icons[p.icon];
  return (
    <Tile
      href={p.url || undefined}
      className={cn(
        span,
        big ? "bg-gradient-to-br from-[#123a26]/60 to-[#121a16]" : "bg-gradient-to-br from-[#0e1512] to-[#121a16]"
      )}
    >
      <div className={cn("flex h-full flex-col justify-between", big ? "min-h-[210px] p-6" : "min-h-[175px] p-4")}>
        <div className="flex items-start justify-between">
          {Icon && <Icon className={cn("text-[#46b07a]", big ? "h-11 w-11" : "h-7 w-7")} />}
          {p.url ? (
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          ) : (
            // A handle without a link (for example a Discord username).
            <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#8c9a91] ring-1 ring-white/10">
              {p.handleOnly ? "Username" : "Link soon"}
            </span>
          )}
        </div>
        <div>
          {!big && <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[#46b07a]">{p.category}</p>}
          <p className={cn("font-display leading-tight", big ? "text-3xl" : "text-xl")}>{p.name}</p>
          <p className="break-words text-sm text-[#8c9a91]">{p.handle}</p>
          <p className={cn("mt-2 border-t border-white/10 pt-2 text-white/70", big ? "text-sm" : "text-xs")}>
            {p.blurb}
          </p>
        </div>
      </div>
    </Tile>
  );
}

export default function PlatformsPage() {
  const main = mainIds
    .map((id) => platforms.find((p) => p.id === id))
    .filter((p): p is Platform => Boolean(p));
  const more = platforms.filter((p) => !mainIds.includes(p.id));

  return (
    <div className="mx-auto max-w-[1600px] px-3 pb-10 pt-[4.5rem]">
      <div className="px-2 pb-4">
        <p className={eyebrow}>Platforms</p>
        <AnimatedHeading
          as="h1"
          text="Find me *everywhere*"
          wordClassName="text-extrude"
          className="font-display mt-2 text-4xl leading-[0.95] md:text-7xl"
        />
        <p className="mt-4 max-w-2xl text-[15px] text-white/75">
          Every place I post, write, build and compete. Start with the five below, or browse the rest.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {main.map((p, i) => (
          <Card
            key={p.id}
            p={p}
            big
            span={i < 3 ? "col-span-12 sm:col-span-6 lg:col-span-4" : "col-span-12 sm:col-span-6"}
          />
        ))}
      </div>

      <p className={cn(eyebrow, "mb-3 mt-9 px-2")}>More places</p>
      <div className="grid grid-cols-12 gap-3">
        {more.map((p) => (
          <Card key={p.id} p={p} span="col-span-6 md:col-span-4 lg:col-span-2" />
        ))}
      </div>
    </div>
  );
}
