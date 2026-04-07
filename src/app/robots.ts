/**
 * robots.ts — auto-generates /robots.txt at build time.
 *
 * Tells web crawlers they're allowed to index everything, and points them
 * to the sitemap so they can discover all pages efficiently.
 */

import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://shubhiupadhyay.github.io/digital-garden/sitemap.xml",
  };
}
