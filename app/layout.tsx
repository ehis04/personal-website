import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";

import { platforms } from "@/config/platforms";
import { siteConfig } from "@/config/site";
import { profile } from "@/config/studio";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#060908",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${profile.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.authorName, url: siteConfig.url }],
  creator: siteConfig.authorName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: profile.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: profile.name }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ehis_oghina",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION },
};

// Structured data (schema.org) so search engines can tie the name, site and profiles together.
// Built only from verified facts (CV); sameAs lists the profiles that have a real link.
const sameAs = platforms.filter((p) => p.url).map((p) => p.url);
const personJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: profile.name,
      alternateName: ["E. Oghina", "Ehis Oghina"],
      jobTitle: profile.mainRole,
      description: siteConfig.description,
      url: siteConfig.url,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      sameAs,
      alumniOf: { "@type": "CollegeOrUniversity", name: "Dublin City University" },
      affiliation: { "@type": "CollegeOrUniversity", name: "University of Birmingham" },
      worksFor: { "@type": "Organization", name: "R.V. Uncovered" },
      knowsAbout: [
        "Artificial intelligence",
        "Machine learning",
        "Natural language processing",
        "Football analytics",
        "Data science",
        "Software engineering",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: profile.name,
      alternateName: [`${profile.name} | ${profile.mainRole}`],
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#person` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only a real-looking Google Analytics id turns analytics on. A template placeholder such as
  // G-XXXXXXXXXX is ignored, so no tracking script loads by accident. If analytics is ever
  // enabled, update the Privacy page too.
  const rawGa = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID?.trim();
  const GA_ID = rawGa && /^G-[A-Z0-9]{6,}$/.test(rawGa) && !/X{4,}/.test(rawGa) ? rawGa : undefined;

  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-[#060908] font-sans antialiased", fontSans.variable)}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
