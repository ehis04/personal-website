import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AnimatedHeading } from "@/components/studio/animated-heading";
import { siteConfig } from "@/config/site";
import { Paper, papers } from "@/config/studio";

const hosted = papers.filter((p): p is Paper & { slug: string } => Boolean(p.slug));
const find = (slug: string) => hosted.find((p) => p.slug === slug);

const eyebrow = "legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]";

export const dynamicParams = false;

export function generateStaticParams() {
  return hosted.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = find(slug);
  if (!p) return {};
  const pdfUrl = p.pdf ? `${siteConfig.url}${p.pdf}` : undefined;
  return {
    title: p.title,
    description: p.abstract,
    alternates: { canonical: `/research/${p.slug}` },
    // Highwire Press tags: the format Google Scholar reads to index a paper hosted on a personal site.
    other: {
      citation_title: p.title,
      citation_author: p.authors ?? [],
      ...(p.date ? { citation_publication_date: p.date.replace(/-/g, "/") } : {}),
      ...(pdfUrl ? { citation_pdf_url: pdfUrl } : {}),
      ...(p.keywords ? { citation_keywords: p.keywords.join("; ") } : {}),
      citation_abstract_html_url: `${siteConfig.url}/research/${p.slug}`,
      citation_language: "en",
      ...(p.doi ? { citation_doi: p.doi } : {}),
    },
  };
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = find(slug);
  if (!p) notFound();

  const authors = (p.authors ?? []).join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: p.title,
    author: (p.authors ?? []).map((name) => ({ "@type": "Person", name })),
    datePublished: p.date,
    abstract: p.fullAbstract,
    keywords: p.keywords?.join(", "),
    inLanguage: "en",
    url: `${siteConfig.url}/research/${p.slug}`,
    ...(p.pdf ? { encoding: { "@type": "MediaObject", contentUrl: `${siteConfig.url}${p.pdf}`, encodingFormat: "application/pdf" } } : {}),
  };

  return (
    <div className="mx-auto max-w-[1300px] px-3 pb-6 pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Link
        href="/research"
        className="mb-6 inline-flex items-center gap-2 px-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-dim)] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to research
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="recess bg-gradient-to-br from-[#123a26]/60 to-[#0c110f] p-6 md:p-10" style={{ borderRadius: 26 }}>
          <p className={eyebrow}>{p.venue} · {p.year}</p>
          <AnimatedHeading
            as="h1"
            text={p.title}
            wordClassName="text-sheen"
            className="font-display mt-3 text-3xl leading-[1.02] md:text-5xl"
          />
          {p.subtitle && <p className="mt-3 text-lg italic text-white/75">{p.subtitle}</p>}
          <p className="mt-4 text-sm text-white/80">{authors}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {p.pdf && (
              <a
                href={p.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#2f7d50] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#46b07a]"
              >
                Read the PDF <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {p.pdf && (
              <a
                href={p.pdf}
                download
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            )}
            {p.ssrnUrl && (
              <a
                href={p.ssrnUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm ring-1 ring-white/25 transition-colors hover:bg-white/10"
              >
                View on SSRN <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>

          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">Abstract</p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85">{p.fullAbstract}</p>

          {p.keywords && (
            <div className="mt-6 flex flex-wrap gap-2">
              {p.keywords.map((k) => (
                <span key={k} className="rounded-full bg-[#123a26]/70 px-3 py-1 text-xs ring-1 ring-[#2f7d50]/40">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {p.cover && (
            <div className="recess relative overflow-hidden bg-white" style={{ borderRadius: 26 }}>
              <Image
                src={p.cover}
                alt="First page of the paper"
                width={640}
                height={561}
                unoptimized
                priority
                className="h-auto w-full"
              />
            </div>
          )}
          <div className="recess bg-[var(--surface-2)] p-6" style={{ borderRadius: 26 }}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--green-glow)]">Cite as</p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {authors} ({p.year}). {p.title}. {p.subtitle ? `${p.subtitle}. ` : ""}Preprint.{" "}
              {p.doi ? `https://doi.org/${p.doi}` : `${siteConfig.url}/research/${p.slug}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
