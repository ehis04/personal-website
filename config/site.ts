import { profile } from "@/config/studio";

// Feeds canonical links, Open Graph, the sitemap and robots.txt.
// Override with NEXT_PUBLIC_SITE_URL (no trailing slash) for staging or previews.
const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://ehisoghina.com").replace(/\/+$/, "");

export const siteConfig = {
  name: `${profile.name} | ${profile.mainRole}`,
  authorName: profile.name,
  // Only verified facts: name, roles and degrees.
  description: `${profile.name} is an ${profile.mainRole} (${profile.education.join(", ")}) who also works as a ${profile.otherRoles
    .slice(0, 3)
    .join(", ")
    .toLowerCase()}. Experience, projects, research and an assistant that answers questions about Ehis.`,
  url,
  // Placeholder social card: swap for a purpose-made 1200x630 image later.
  ogImage: "/media/photo-3.jpg",
  keywords: [profile.name, profile.mainRole, ...profile.otherRoles, ...profile.education],
};

/** Main navigation, shared by the top bar and the footer. */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/ask", label: "Ask" },
  { href: "/platforms", label: "Platforms" },
] as const;
