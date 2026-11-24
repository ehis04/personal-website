import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/experience", priority: 0.8 },
  { path: "/projects", priority: 0.8 },
  { path: "/research", priority: 0.7 },
  { path: "/ask", priority: 0.6 },
  { path: "/platforms", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
