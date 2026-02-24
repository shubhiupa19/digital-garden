import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://shubhiupadhyay.github.io/digital-garden";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const notes = await getAllNotes();

  const noteEntries: MetadataRoute.Sitemap = notes.map((note) => ({
    url: `${BASE_URL}/notes/${note.slug}`,
    lastModified: note.frontmatter.updated || note.frontmatter.date,
    changeFrequency: note.frontmatter.stage === "evergreen" ? "monthly" : "weekly",
    priority: note.frontmatter.stage === "evergreen" ? 0.8 : 0.6,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date().toISOString().slice(0, 10), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/notes`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/graph`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/log`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/tags`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/questions`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/changelog`, changeFrequency: "weekly", priority: 0.4 },
  ];

  return [...staticPages, ...noteEntries];
}
