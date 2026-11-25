import { profile } from "@/config/studio";

// Feeds canonical links, Open Graph, the sitemap and robots.txt.
// Override with NEXT_PUBLIC_SITE_URL (no trailing slash) for staging or previews.
const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://ehisoghina.com").replace(/\/+$/, "");

// Public contact email. Set NEXT_PUBLIC_CONTACT_EMAIL in .env (git-ignored, so it never
// lands in the public repo). Unset = no email is shown and the site points to /platforms.
export const contactEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

// This file is imported by server code only. Pages receive the address base64-encoded plus a
// "name [at] domain" fallback, so the plain address never appears in the HTML or JavaScript
// (see components/studio/email-link.tsx).
export const contactEmailEncoded = contactEmail ? Buffer.from(contactEmail).toString("base64") : "";
export const contactEmailFallback = contactEmail.replace("@", " [at] ");

export const siteConfig = {
  // The default <title> and the name shown when the site is shared.
  name: `${profile.name} | ${profile.mainRole}, Data Scientist and Football Analyst`,
  authorName: profile.name,
  // Only verified facts (CV): roles, degrees and what the site holds.
  description: `${profile.name} is an ${profile.mainRole} and NLP researcher (${profile.education[0]}, Dublin City University; ${profile.education[1]}, University of Birmingham) who builds football analytics and full-stack products. Explore my experience, projects, research, CV and an AI assistant that answers questions about my work.`,
  url,
  // Social share card, 1200x630 (cropped from the DSC portrait).
  ogImage: "/og.jpg",
  keywords: [
    profile.name,
    "Ehis Oghina AI Engineer",
    profile.mainRole,
    ...profile.otherRoles,
    "NLP researcher",
    "football analytics",
    "machine learning",
    ...profile.education,
    "Dublin City University",
    "University of Birmingham",
  ],
};
