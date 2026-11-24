import { ArrowUp, ArrowUpRight, Github, Linkedin, Mic, Play, Volume2, Youtube } from "lucide-react";
import Link from "next/link";

import { AnimatedHeading } from "@/components/studio/animated-heading";
import { Chapter } from "@/components/studio/chapter";
import { DocPreview } from "@/components/studio/doc-preview";
import { Scroller, Screen } from "@/components/studio/scroller";
import { Tile } from "@/components/studio/tile";
import { degrees, experiences, profile, studioProjects } from "@/config/studio";

const eyebrow = "legible text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]";
const title = "legible font-display text-2xl leading-tight md:text-3xl";
const arrow =
  "h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1";
const chip = "rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/85 ring-1 ring-white/10";
const mobileMin = "min-h-[240px] lg:min-h-0";

// Only a real https link wires the button; the template placeholder stays inert.
const resumeUrl = process.env.NEXT_PUBLIC_RESUME_LINK?.startsWith("https://")
  ? process.env.NEXT_PUBLIC_RESUME_LINK
  : undefined;

export default function PreviewHome() {
  return (
    <Scroller labels={["Home", "Experience", "Projects", "Research", "Ask", "Contact"]}>
      {/* ───────── Screen 1: the mosaic ───────── */}
      <Screen first>
      <div className="grid h-full grid-cols-12 auto-rows-[minmax(230px,auto)] gap-3 p-3 lg:grid-rows-3">
        <Tile
          media={{ kind: "image", src: "/media/photo-3.jpg", position: "50% 20%" }}
          alt={profile.name}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="col-span-12 min-h-[70svh] lg:col-span-6 lg:row-span-2 lg:min-h-0"
        >
          <div className="mt-auto p-6 md:p-9">
            <AnimatedHeading as="h1" text={profile.name} wordClassName="text-extrude" className="font-display text-5xl leading-[0.95] md:text-8xl" />
            <AnimatedHeading as="p" text="AI *Engineer*" delay={0.25} wordClassName="text-shimmer" className="font-display mt-3 text-3xl md:text-5xl" />
            <p className="mt-3 text-sm text-white/85 md:text-base">
              {profile.education.join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.otherRoles.map((r) => (
                <span key={r} className={chip}>
                  {r}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--green-glow)]"
              >
                See my work <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/experience"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10"
              >
                Experience
              </Link>
            </div>
          </div>
        </Tile>

        <Tile
          href="/experience"
          media={{ kind: "image", src: "/media/photo-5.jpg", position: "50% 22%" }}
          sizes="(min-width: 1024px) 25vw, 100vw"
          className="col-span-12 md:col-span-6 lg:col-span-3"
        >
          <div className="mt-auto flex items-end justify-between p-5">
            <div>
              <p className={eyebrow}>Experience</p>
              <p className={title}>{experiences.length} roles</p>
            </div>
            <ArrowUpRight className={arrow} />
          </div>
        </Tile>

        <Tile
          href="/projects"
          media={{ kind: "video", src: "/media/gym-a.mp4", poster: "/media/gym-a.jpg" }}
          className="col-span-12 min-h-[420px] md:col-span-6 lg:col-span-3 lg:row-span-2 lg:min-h-0"
        >
          <div className="mt-auto flex items-end justify-between p-5">
            <div>
              <p className={eyebrow}>Projects</p>
              <p className={title}>Models, tools &amp; demos</p>
            </div>
            <ArrowUpRight className={arrow} />
          </div>
        </Tile>

        <Tile href="/research" className="col-span-12 bg-gradient-to-br from-[var(--surface-2)] to-[#123a26]/60 md:col-span-6 lg:col-span-3">
          <div className="flex h-full flex-col p-5">
            <p className={eyebrow}>Research</p>
            <ul className="mt-3 space-y-2.5 text-sm">
              {[
                ["NLP", "SemEval 2027: language steering", "University of Birmingham · in progress"],
                ["DATA", "Trivium: U-17 World Cup analytics", "FIFA U-17 World Cups 2025"],
                ["ML", "xgGaffer: football ML engines", "Final-year project · 2026"],
              ].map(([badge, t, sub]) => (
                <li key={t} className="flex items-start gap-3 rounded-xl bg-black/30 p-3 ring-1 ring-white/5">
                  <span className="mt-0.5 grid h-7 w-9 shrink-0 place-items-center rounded-md bg-[#2f7d50]/25 text-[10px] text-[var(--green-glow)]">
                    {badge}
                  </span>
                  <span>
                    {t}
                    <span className="block text-xs text-[var(--ink-dim)]">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-auto flex items-center justify-between pt-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
              All research <ArrowUpRight className="h-4 w-4" />
            </p>
          </div>
        </Tile>

        <Tile href="/ask" className="col-span-12 bg-[var(--surface-2)] md:col-span-6 lg:col-span-4">
          <div className="flex h-full flex-col justify-between p-5">
            <div>
              <p className={eyebrow}>Ask me anything</p>
              <p className={title}>A chat that knows my work</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["My projects", "Football models", "Experience", "Research"].map((c) => (
                  <span key={c} className={chip}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-black/45 p-2 pl-5 ring-1 ring-white/10">
              <span className="flex-1 truncate text-sm text-[var(--ink-dim)]">
                What did you build with football data?
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-white/15">
                <Mic className="h-4 w-4" />
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--green)]">
                <ArrowUp className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Tile>

        <Tile
          media={{ kind: "video", src: "/media/talk-a.mp4", poster: "/media/talk-a.jpg" }}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <div className="mt-auto flex items-center gap-3 p-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--green)]">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <div>
              <p className={eyebrow}>Latest video</p>
              <p className="text-sm">Video title placeholder</p>
            </div>
          </div>
        </Tile>

        {/* The graduate is small in the source photo, so zoom in on them. */}
        <Tile
          media={{ kind: "image", src: "/media/grad-crop.jpg", position: "50% 50%" }}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="col-span-12 md:col-span-6 lg:col-span-4"
        >
          <div className="mt-auto p-5">
            <p className={eyebrow}>{degrees[1].school}</p>
            <p className={title}>{degrees[1].degree}</p>
          </div>
        </Tile>
      </div>

      </Screen>

      {/* ───────── Chapters: each fills the screen and snaps into place ───────── */}
      <>
        {/* 01 Experience */}
        <Chapter index={1} kicker="Experience" title="Where I've *built*" href="/experience" cta="All experience">
          <Tile
            href="/experience"
            media={{ kind: "image", src: "/media/photo-3.jpg", position: "50% 25%" }}
            className={`col-span-12 lg:col-span-7 lg:row-span-2 ${mobileMin}`}
          >
            <div className="mt-auto p-6 md:p-8">
              <p className={eyebrow}>Current · {experiences[0].period}</p>
              <p className="font-display text-extrude mt-1 text-4xl leading-none md:text-7xl">{experiences[0].role}</p>
              <p className="mt-2 text-lg text-white/90">{experiences[0].company}</p>
              <p className="mt-3 max-w-lg text-sm text-white/75">{experiences[0].summary}</p>
            </div>
          </Tile>
          <Tile
            media={{ kind: "image", src: "/media/grad-crop.jpg", position: "50% 50%" }}
            className={`col-span-12 md:col-span-6 lg:col-span-5 ${mobileMin}`}
          >
            <div className="mt-auto p-5">
              <p className={eyebrow}>Education</p>
              <p className={title}>{degrees[1].degree}</p>
              <p className="text-sm text-white/80">{degrees[1].school}</p>
              <p className="mt-1 text-xs text-white/65">Next: {degrees[0].degree}, {degrees[0].school}</p>
            </div>
          </Tile>
          <Tile className={`col-span-12 bg-[var(--surface-2)] md:col-span-6 lg:col-span-5 ${mobileMin}`}>
            <div className="flex h-full flex-col p-5">
              <p className={eyebrow}>Also</p>
              <ul className="mt-3 grid flex-1 grid-rows-3 divide-y divide-white/5 text-sm">
                {experiences.slice(1, 4).map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 py-3">
                    <span>
                      <span className="font-display block text-lg leading-tight md:text-xl">{e.company}</span>
                      <span className="text-xs text-white/70">{e.role}</span>
                    </span>
                    <span className="shrink-0 text-xs text-[var(--ink-dim)]">{e.period.replace(" — ", " – ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Tile>
        </Chapter>

        {/* 02 Projects */}
        <Chapter index={2} kicker="Projects" title="What I've *made*" href="/projects" cta="All projects">
          <Tile
            href="/projects"
            media={{ kind: "video", src: "/media/gym-b.mp4", poster: "/media/gym-b.jpg" }}
            className={`col-span-12 lg:col-span-7 lg:row-span-2 ${mobileMin}`}
          >
            <div className="mt-auto flex items-end justify-between gap-4 p-6 md:p-8">
              <div>
                <p className={eyebrow}>Flagship · Sports analytics</p>
                <p className="font-display text-extrude mt-1 text-4xl leading-none md:text-7xl">{studioProjects[0].title}</p>
                <p className="mt-3 max-w-lg text-sm text-white/75">
                  A football analytics platform: 43,000+ matches, 86+ features and seven ML models, with a grounded natural-language query layer.
                </p>
              </div>
              <span className="hidden rounded-full bg-[var(--green)] px-4 py-2 text-xs sm:block">
                Live demo planned
              </span>
            </div>
          </Tile>
          <Tile className={`col-span-12 bg-gradient-to-r from-[#123a26]/70 to-[var(--surface-2)] lg:col-span-5 ${mobileMin}`}>
            <div className="flex h-full flex-col justify-between p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={eyebrow}>Prototype data</p>
                  <p className={title}>Next fixture</p>
                </div>
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-[var(--ink-dim)] ring-1 ring-white/10">
                  Demo numbers
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ["xG", "1.8 – 1.1"],
                  ["Likely", "2 – 1"],
                  ["Confidence", "High"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-black/30 px-2 py-3 ring-1 ring-white/5">
                    <p className="font-display text-xl">{v}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">{k}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex h-3 overflow-hidden rounded-full ring-1 ring-white/10">
                  <span className="bg-[var(--green-glow)]" style={{ width: "46%" }} />
                  <span className="bg-white/30" style={{ width: "27%" }} />
                  <span className="bg-[var(--green-deep)]" style={{ width: "27%" }} />
                </div>
                <div className="mt-2 flex justify-between text-xs text-[var(--ink-dim)]">
                  <span>Home 46%</span>
                  <span>Draw 27%</span>
                  <span>Away 27%</span>
                </div>
              </div>
            </div>
          </Tile>
          <div className="col-span-12 grid grid-cols-3 gap-3 lg:col-span-5">
            {[
              [studioProjects[1].title, studioProjects[1].kicker, "/media/photo-1.jpg", "50% 18%"],
              [studioProjects[2].title, studioProjects[2].kicker, "/media/photo-5.jpg", "50% 25%"],
              [studioProjects[3].title, studioProjects[3].kicker, "/media/photo-2.jpg", "50% 35%"],
            ].map(([t, k, src, pos]) => (
              <Tile
                key={t}
                href="/projects"
                media={{ kind: "image", src, position: pos }}
                sizes="(min-width: 1024px) 15vw, 33vw"
                className="min-h-[160px] lg:min-h-0"
              >
                <div className="mt-auto p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--green-glow)]">{k}</p>
                  <p className="font-display text-base leading-tight">{t}</p>
                </div>
              </Tile>
            ))}
          </div>
        </Chapter>

        {/* 03 Research & socials */}
        <Chapter
          index={3}
          kicker="Research"
          title="What I'm *researching*"
          href="/research"
          cta="Research & videos"
          rows="lg:grid-rows-[3fr_2fr]"
        >
          <Tile className={`col-span-12 bg-gradient-to-br from-[#123a26]/70 to-[var(--surface-2)] lg:col-span-5 lg:row-span-2 ${mobileMin}`}>
            <div className="flex h-full flex-col p-6 md:p-8">
              <p className={eyebrow}>Current research</p>
              <p className="font-display mt-2 text-3xl leading-tight md:text-4xl">
                Cross-lingual alignment &amp; activation steering
              </p>
              <p className="mt-3 text-sm text-white/75">
                Part of a University of Birmingham NLP team taking part in SemEval 2027, studying how to steer the
                language large language models generate.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["SemEval 2027", "University of Birmingham", "NLP"].map((c) => (
                  <span key={c} className={chip}>
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex flex-1 items-center py-6">
                <DocPreview />
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium">
                In progress
              </span>
            </div>
          </Tile>
          <Tile
            media={{ kind: "video", src: "/media/talk-a.mp4", poster: "/media/talk-a.jpg" }}
            className={`col-span-12 lg:col-span-7 ${mobileMin}`}
          >
            <div className="mt-auto flex items-center gap-4 p-6">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--green)]">
                <Play className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className={eyebrow}>Latest on YouTube</p>
                <p className="font-display text-2xl">Video title placeholder</p>
              </div>
            </div>
          </Tile>
          <div className="col-span-12 grid grid-cols-3 gap-3 lg:col-span-7">
            {[
              [Youtube, "YouTube", "Channel name"],
              [Github, "GitHub", "Username"],
              [Linkedin, "LinkedIn", "Profile"],
            ].map(([Icon, name, sub]) => {
              const I = Icon as typeof Youtube;
              return (
                <Tile key={name as string} href="/platforms" className="min-h-[130px] bg-[var(--surface-2)] lg:min-h-0">
                  <div className="flex h-full flex-col justify-between p-4">
                    <I className="h-9 w-9 text-[#46b07a]" />
                    <div>
                      <p className="font-display text-lg">{name as string}</p>
                      <p className="text-xs text-[var(--ink-dim)]">{sub as string}</p>
                      <p className="mt-3 border-t border-white/10 pt-3 text-xs text-white/70">Latest: placeholder title</p>
                    </div>
                  </div>
                </Tile>
              );
            })}
          </div>
        </Chapter>

        {/* 04 Ask */}
        <Chapter index={4} kicker="Ask" title="Ask me *anything*" href="/ask" cta="Open the chat">
          <Tile className={`col-span-12 bg-[var(--surface-2)] lg:col-span-8 lg:row-span-2 ${mobileMin}`}>
            <div className="flex h-full flex-col gap-3 p-5 md:p-6">
              {[
                ["What did you build with football data?", "Sample answer: the real assistant will answer from my CV, projects and papers, in text or read aloud."],
                ["Which roles have you held?", "Sample answer: it will list my roles with dates, and link to the full experience page."],
                ["What is xgGaffer?", "Sample answer: it will explain the platform, the data it uses and the models behind it, and link to the live demo."],
              ].map(([q, a]) => (
                <div key={q} className="flex flex-col gap-3">
                  <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-[var(--green)] px-4 py-3 text-sm">{q}</div>
                  <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-black/40 px-4 py-3.5 text-[15px] text-white/85 ring-1 ring-white/10">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[var(--green-glow)]">Sample</p>
                    {a}
                  </div>
                </div>
              ))}
              <div className="mt-auto flex flex-wrap gap-2">
                {["My projects", "Football models", "Research", "Contact"].map((c) => (
                  <span key={c} className={chip}>{c}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-full bg-black/45 p-2 pl-5 ring-1 ring-white/10">
                <span className="flex-1 truncate text-sm text-[var(--ink-dim)]">Type, or press the mic and speak…</span>
                <span className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/15">
                  <Mic className="h-4 w-4" />
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--green)]">
                  <ArrowUp className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Tile>
          <Tile className={`col-span-12 bg-gradient-to-br from-[#123a26]/70 to-[var(--surface-2)] md:col-span-6 lg:col-span-4 ${mobileMin}`}>
            <div className="flex h-full flex-col p-5">
              <p className={eyebrow}>Try asking</p>
              <ul className="mt-3 space-y-2 text-sm">
                {["What are you working on now?", "What is xgGaffer?", "Which roles have you held?", "What are you researching at Birmingham?", "What did you study?"].map(
                  (q) => (
                    <li key={q} className="rounded-xl bg-black/30 px-4 py-3.5 text-[15px] ring-1 ring-white/5">
                      {q}
                    </li>
                  )
                )}
              </ul>
            </div>
          </Tile>
          <Tile className={`col-span-12 bg-[var(--surface-2)] md:col-span-6 lg:col-span-4 ${mobileMin}`}>
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-[var(--green-glow)]" />
                <p className={eyebrow}>Hear the answer</p>
              </div>
              <div className="flex flex-1 items-center gap-1 py-4" aria-hidden="true">
                {[30, 55, 40, 80, 60, 95, 50, 70, 35, 60, 45, 75, 30, 55, 40, 65, 85, 45, 70, 35].map((h, i) => (
                  <span key={i} className="flex-1 self-center rounded-full bg-[#2f7d50]/80" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="text-xs text-[var(--ink-dim)]">Voice in, voice out. Text works too.</p>
            </div>
          </Tile>
        </Chapter>

        {/* 05 Contact */}
        <Chapter index={5} kicker="Contact" title="Let's work *together*" href="/platforms" cta="Find me online">
          <Tile
            media={{ kind: "image", src: "/media/photo-2.jpg", position: "50% 35%" }}
            className={`col-span-12 lg:col-span-8 lg:row-span-2 ${mobileMin}`}
          >
            <div className="flex h-full flex-col justify-end bg-gradient-to-br from-[#2f7d50]/55 to-[#123a26]/75 p-6 md:p-10">
              <p className="font-display text-extrude text-4xl leading-[0.95] md:text-7xl">
                Have a project, a role or a <span className="font-accent text-accent-glow">question?</span>
              </p>
              <p className="mt-4 max-w-md text-sm text-white/85">
                Placeholder: availability, what you are open to, and how quickly you reply.
              </p>
            </div>
          </Tile>
          <Tile className={`col-span-12 bg-[var(--surface-2)] md:col-span-6 lg:col-span-4 ${mobileMin}`}>
            <div className="flex h-full flex-col justify-between p-5">
              <p className={eyebrow}>Email</p>
              <div>
                <p className="font-display text-2xl md:text-3xl">hello@your-domain.com</p>
                <p className="mt-2 text-sm text-white/70">Placeholder: usually replies within a couple of days.</p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--green)] px-5 py-2.5 text-sm font-medium">
                Send a message <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Tile>
          <Tile href={resumeUrl} className={`col-span-12 bg-gradient-to-br from-[#123a26]/70 to-[var(--surface-2)] md:col-span-6 lg:col-span-4 ${mobileMin}`}>
            <div className="flex h-full flex-col p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className={eyebrow}>Download</p>
                  <p className="font-display text-2xl">Résumé (PDF)</p>
                </div>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="flex flex-1 items-center py-3">
                <DocPreview className="w-[min(46%,170px)]" />
              </div>
            </div>
          </Tile>
        </Chapter>
      </>
    </Scroller>
  );
}
