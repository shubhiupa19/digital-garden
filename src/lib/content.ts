/**
 * lib/content.ts — data access layer for all content.
 *
 * All file reads happen here. Pages and components never touch the filesystem
 * directly — they call these functions. This keeps I/O in one place and makes
 * it easy to change how content is stored without touching the UI.
 *
 * Notes live at:  content/notes/<topic>/<slug>.mdx
 * Log entries at: content/log/<YYYY-MM-DD>.mdx
 * Misc content:   content/interests.md, content/questions.md, content/changelog.md
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { glob } from "glob";
import type {
  Note,
  NoteFrontmatter,
  LogEntry,
  TagWithCount,
  MaturityStage,
  Topic,
} from "@/types/content";
import { VALID_STAGES, VALID_TOPICS } from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const NOTES_DIR = path.join(CONTENT_DIR, "notes");
const LOG_DIR = path.join(CONTENT_DIR, "log");

// Throws a descriptive error at build time if a note's frontmatter is missing
// required fields or uses an invalid topic/stage. This makes the build fail
// fast and loudly rather than silently rendering a broken note.
function validateFrontmatter(
  data: Record<string, unknown>,
  filepath: string
): NoteFrontmatter {
  if (!data.title) throw new Error(`Missing title in ${filepath}`);
  if (!data.date) throw new Error(`Missing date in ${filepath}`);
  if (!data.stage) throw new Error(`Missing stage in ${filepath}`);
  if (!data.topic) throw new Error(`Missing topic in ${filepath}`);

  if (!VALID_STAGES.includes(data.stage as MaturityStage)) {
    throw new Error(
      `Invalid stage "${data.stage}" in ${filepath}. Must be one of: ${VALID_STAGES.join(", ")}`
    );
  }
  if (!VALID_TOPICS.includes(data.topic as Topic)) {
    throw new Error(
      `Invalid topic "${data.topic}" in ${filepath}. Must be one of: ${VALID_TOPICS.join(", ")}`
    );
  }

  return {
    title: data.title as string,
    date: String(data.date),
    updated: data.updated ? String(data.updated) : undefined,
    stage: data.stage as MaturityStage,
    topic: data.topic as Topic,
    tags: Array.isArray(data.tags) ? data.tags.map((t: string) => t.toLowerCase()) : [],
    connections: Array.isArray(data.connections) ? data.connections : [],
  };
}

// In-memory cache so getAllNotes() only hits the filesystem once per build.
// The cache is process-scoped — it resets on each `next build` or `next dev` restart.
let notesCache: Note[] | null = null;

/** Returns all notes sorted by date descending (most recent first). */
export async function getAllNotes(): Promise<Note[]> {
  if (notesCache) return notesCache;

  const files = await glob("**/*.mdx", { cwd: NOTES_DIR });
  const notes: Note[] = [];

  for (const file of files) {
    const filepath = path.join(NOTES_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = validateFrontmatter(data, filepath);
    const slug = file.replace(/\.mdx$/, "");
    const rt = readingTime(content);

    notes.push({
      slug,
      frontmatter,
      content,
      readingTime: rt.text,
    });
  }

  notes.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  notesCache = notes;
  return notes;
}

/** Fetches a single note by its slug (e.g. "crypto/bitcoin-basics"). Returns null if not found. */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const filepath = path.join(NOTES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = validateFrontmatter(data, filepath);
  const rt = readingTime(content);

  return { slug, frontmatter, content, readingTime: rt.text };
}

/**
 * Returns all note slugs for Next.js static generation.
 * Called by generateStaticParams() in the note page to pre-render every note at build time.
 */
export async function getNoteSlugs(): Promise<string[]> {
  const files = await glob("**/*.mdx", { cwd: NOTES_DIR });
  return files.map((f) => f.replace(/\.mdx$/, ""));
}

/** Aggregates all tags across every note, sorted by frequency (most used first). */
export async function getAllTags(): Promise<TagWithCount[]> {
  const notes = await getAllNotes();
  const tagMap = new Map<string, string[]>();

  for (const note of notes) {
    for (const tag of note.frontmatter.tags) {
      // Tags are already lowercased at parse time in validateFrontmatter.
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag)!.push(note.slug);
    }
  }

  const tags: TagWithCount[] = [];
  for (const [tag, noteSlugs] of tagMap) {
    tags.push({ tag, count: noteSlugs.length, notes: noteSlugs });
  }

  tags.sort((a, b) => b.count - a.count);
  return tags;
}

/**
 * Returns notes connected to a given note, split into two groups:
 *   manual — explicitly listed in the note's `connections: []` frontmatter (bidirectional)
 *   auto   — discovered automatically because they share 2+ tags with this note
 */
export async function getConnectedNotes(
  slug: string
): Promise<{ manual: Note[]; auto: Note[] }> {
  const allNotes = await getAllNotes();
  const note = allNotes.find((n) => n.slug === slug);
  if (!note) return { manual: [], auto: [] };

  // Manual connections: explicit frontmatter connections (bidirectional)
  const manualSlugs = new Set<string>();

  for (const connSlug of note.frontmatter.connections) {
    manualSlugs.add(connSlug);
  }
  for (const n of allNotes) {
    if (n.slug !== slug && n.frontmatter.connections.includes(slug)) {
      manualSlugs.add(n.slug);
    }
  }

  const manual = allNotes.filter((n) => manualSlugs.has(n.slug));

  // Auto connections: notes sharing 2+ tags (excluding already-manual ones).
  // Tags are already lowercased at parse time so no normalization needed here.
  const noteTags = new Set(note.frontmatter.tags);
  const auto: Note[] = [];

  if (noteTags.size > 0) {
    for (const other of allNotes) {
      if (other.slug === slug || manualSlugs.has(other.slug)) continue;
      const shared = other.frontmatter.tags.filter((t) => noteTags.has(t));
      if (shared.length >= 2) {
        auto.push(other);
      }
    }
  }

  return { manual, auto };
}

/** All connections for the graph — both manual and auto-discovered */
export async function getAllConnections(): Promise<
  { source: string; target: string; type: "manual" | "auto" }[]
> {
  const allNotes = await getAllNotes();
  const connections: { source: string; target: string; type: "manual" | "auto" }[] = [];
  const seen = new Set<string>();

  // Manual connections from frontmatter
  for (const note of allNotes) {
    for (const target of note.frontmatter.connections) {
      const exists = allNotes.some((n) => n.slug === target);
      if (!exists) continue;
      const key = [note.slug, target].sort().join(":::");
      if (seen.has(key)) continue;
      seen.add(key);
      connections.push({ source: note.slug, target, type: "manual" });
    }
  }

  // Auto connections: notes sharing 2+ tags.
  // Tags are already lowercased at parse time so no normalization needed here.
  for (let i = 0; i < allNotes.length; i++) {
    const a = allNotes[i];
    const aTags = new Set(a.frontmatter.tags);
    if (aTags.size === 0) continue;

    for (let j = i + 1; j < allNotes.length; j++) {
      const b = allNotes[j];
      const key = [a.slug, b.slug].sort().join(":::");
      if (seen.has(key)) continue;

      const shared = b.frontmatter.tags.filter((t) => aTags.has(t));
      if (shared.length >= 2) {
        seen.add(key);
        connections.push({ source: a.slug, target: b.slug, type: "auto" });
      }
    }
  }

  return connections;
}

/** Returns all log entries sorted by date descending. */
export async function getLogEntries(): Promise<LogEntry[]> {
  if (!fs.existsSync(LOG_DIR)) return [];

  const files = await glob("*.mdx", { cwd: LOG_DIR });
  const entries: LogEntry[] = [];

  for (const file of files) {
    const filepath = path.join(LOG_DIR, file);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");

    entries.push({
      slug,
      date: data.date ? String(data.date) : slug,
      content,
    });
  }

  entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return entries;
}

/**
 * Loads a plain markdown file from the content/ root (e.g. "interests.md").
 * Strips frontmatter if present and returns just the body content.
 */
export async function getMarkdownContent(
  filename: string
): Promise<string | null> {
  const filepath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  const raw = fs.readFileSync(filepath, "utf-8");
  const { content } = matter(raw);
  return content;
}
