import { profile } from "@/config/studio";

// Feeds canonical links, Open Graph, the sitemap and robots.txt.
// Override with NEXT_PUBLIC_SITE_URL (no trailing slash) for staging or previews.
const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://ehisoghina.com").replace(/\/+$/, "");

// Public contact email. Set NEXT_PUBLIC_CONTACT_EMAIL in .env (git-ignored, so it never
// lands in the public repo). Unset = no email is shown and the site points to /platforms.
export const contactEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim();

export const siteConfig = {
  name: `${profile.name} | ${profile.mainRole}`,
  authorName: profile.name,
  // Only verified facts: name, roles and degrees.
  description: `${profile.name} is an ${profile.mainRole} (${profile.education.join(", ")}) who also works as a ${profile.otherRoles
    .slice(0, 3)
    .join(", ")
    .toLowerCase()}. Experience, projects, research and an assistant that answers questions about Ehis.`,
  url,
  // Social share card, 1200x630 (cropped from the DSC portrait).
  ogImage: "/og.jpg",
  keywords: [profile.name, profile.mainRole, ...profile.otherRoles, ...profile.education],
};

/** Main navigation, shared by the top bar and the footer. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/cv", label: "CV" },
  { href: "/ask", label: "Ask" },
  { href: "/platforms", label: "Platforms" },
] as const;
