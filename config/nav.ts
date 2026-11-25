/** Main navigation, shared by the top bar and the footer. (Kept apart from config/site.ts, which is server-only.) */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/cv", label: "CV" },
  { href: "/ask", label: "Ask" },
  { href: "/platforms", label: "Platforms" },
] as const;
