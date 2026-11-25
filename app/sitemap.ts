import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { papers } from "@/config/studio";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/experience", priority: 0.8 },
  { path: "/projects", priority: 0.8 },
  { path: "/research", priority: 0.7 },
  { path: "/cv", priority: 0.8 },
  { path: "/ask", priority: 0.6 },
  { path: "/platforms", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Papers hosted on this site get their own page.
  const paperPages = papers
    .filter((p) => p.slug)
    .map((p) => ({ path: `/research/${p.slug}`, priority: 0.7 }));

  return [...pages, ...paperPages].map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
