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

// Person data built only from verified facts; sameAs lists platforms that have a real link.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.mainRole,
  url: siteConfig.url,
  sameAs: platforms.filter((p) => p.url).map((p) => p.url),
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
