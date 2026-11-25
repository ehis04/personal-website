import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { profile } from "@/config/studio";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: profile.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#060908",
    theme_color: "#060908",
    icons: [{ src: "/icon.png", sizes: "192x192", type: "image/png" }],
    lang: "en",
    scope: "/",
  };
}
