import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

// Crawlers that collect pages to TRAIN AI models. Well-behaved ones obey this file; Cloudflare's
// bot settings are the second line of defence for the rest. Search engines (Google, Bing, ...) and
// the bots that fetch a page when someone asks an AI assistant about it are deliberately NOT listed,
// so the site stays findable.
const aiTrainingBots = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "omgili",
  "omgilibot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: aiTrainingBots, disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
