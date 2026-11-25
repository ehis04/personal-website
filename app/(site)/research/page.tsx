import { ArrowUpRight, Github, Linkedin, Mail, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AnimatedHeading } from "@/components/studio/animated-heading";
import { DocPreview } from "@/components/studio/doc-preview";
import { LiteYouTube } from "@/components/studio/lite-youtube";
import { Tile } from "@/components/studio/tile";
import { papers, socials, videos } from "@/config/studio";

export const metadata = { title: "Research & videos", alternates: { canonical: "/research" } };

const eyebrow = "legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]";
const chip = "rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/85 ring-1 ring-white/10";
const icons = { youtube: Youtube, github: Github, linkedin: Linkedin, newsletter: Mail } as const;

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-3 mt-10 px-2 first:mt-0">
      <p className={eyebrow}>{kicker}</p>
      <AnimatedHeading
        as="h2"
        text={title}
        wordClassName="text-sheen"
        className="font-display mt-1 text-3xl leading-[0.95] md:text-5xl"
      />
    </div>
  );
}

export default function ResearchPage() {
  const [featured, ...rest] = papers;
  // A paper hosted on this site opens its own page; others link out.
  const featuredPage = featured.slug ? `/research/${featured.slug}` : undefined;

  return (
    <div className="mx-auto max-w-[1600px] px-3 pb-10 pt-[4.5rem]">
      <div className="px-2 pb-2">
        <p className={eyebrow}>Research, videos &amp; socials</p>
        <AnimatedHeading
          as="h1"
          text="Research, videos & *more*"
          wordClassName="text-extrude"
          className="font-display mt-2 max-w-4xl text-4xl leading-[0.95] md:text-7xl"
        />
      </div>

      {/* Papers */}
      <SectionHead kicker="Research" title="What I'm *investigating*" />
      <div className="grid grid-cols-12 gap-3">
        <Tile className="col-span-12 bg-gradient-to-br from-[#123a26]/70 to-[#121a16] lg:col-span-7 lg:row-span-2 lg:min-h-[420px]">
          <div className="grid h-full gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
            <div className="flex flex-col">
              <p className={eyebrow}>Featured · {featured.venue} · {featured.year}</p>
              <p className={`font-display text-extrude mt-3 leading-[1.05] ${featured.title.length > 70 ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"}`}>{featured.title}</p>
              <p className="mt-4 text-[15px] text-white/80">{featured.abstract}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {featured.tags.map((t) => (
                  <span key={t} className={chip}>{t}</span>
                ))}
              </div>
              {featuredPage ? (
                <Link
                  href={featuredPage}
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2f7d50] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#46b07a]"
                >
                  {featured.status} <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : featured.href ? (
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#2f7d50] px-5 py-2.5 text-sm font-medium"
                >
                  {featured.status} <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <span className="mt-auto inline-flex w-fit items-center rounded-full bg-[#2f7d50] px-5 py-2.5 text-sm font-medium">
                  {featured.status}
                </span>
              )}
            </div>
            <div className="flex items-center py-4">
              {featured.cover ? (
                <Image
                  src={featured.cover}
                  alt="First page of the paper"
                  width={640}
                  height={561}
                  unoptimized
                  className="w-full max-w-[420px] rounded-lg bg-white shadow-2xl ring-1 ring-white/10"
                />
              ) : (
                <DocPreview className="w-[min(80%,260px)]" />
              )}
            </div>
          </div>
        </Tile>

        {rest.map((p) => (
          <Tile key={p.id} className="col-span-12 bg-[#121a16] md:col-span-6 lg:col-span-5">
            <div className="grid h-full grid-cols-[1fr_auto] items-center gap-5 p-5 md:p-6">
              <div>
                <p className={eyebrow}>{p.venue} · {p.year}</p>
                <p className="font-display mt-2 text-2xl leading-tight">{p.title}</p>
                <p className="mt-2 text-sm text-white/70">{p.abstract}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className={chip}>{t}</span>
                  ))}
                </div>
                {p.href ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#46b07a] hover:underline">
                    {p.status} <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-[#46b07a]">{p.status}</p>
                )}
              </div>
              <DocPreview compact className="hidden w-24 sm:block" />
            </div>
          </Tile>
        ))}
      </div>

      {/* Videos */}
      <SectionHead kicker="Videos" title="What I've *filmed*" />
      <div className="grid grid-cols-12 gap-3">
        {videos.map((v) => (
          <Tile key={v.id} className="col-span-12 aspect-video md:col-span-6">
            <LiteYouTube title={v.title} poster={v.poster} youtubeId={v.youtubeId} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
              <p className={eyebrow}>{v.meta}</p>
              <p className="font-display legible text-xl md:text-2xl">{v.title}</p>
            </div>
          </Tile>
        ))}
      </div>

      {/* Socials */}
      <SectionHead kicker="Elsewhere" title="Find me *online*" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {socials.map((s) => {
          const Icon = icons[s.id];
          return (
            <Tile key={s.id} href="/platforms" className="min-h-[190px] bg-[#121a16]">
              <div className="flex h-full flex-col justify-between p-5">
                <div className="flex items-start justify-between">
                  <Icon className="h-9 w-9 text-[#46b07a]" />
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <div>
                  <p className="font-display text-2xl">{s.name}</p>
                  <p className="text-sm text-[#8c9a91]">{s.handle}</p>
                  <p className="mt-2 border-t border-white/10 pt-2 text-xs text-white/65">{s.note}</p>
                </div>
              </div>
            </Tile>
          );
        })}
      </div>
    </div>
  );
}
