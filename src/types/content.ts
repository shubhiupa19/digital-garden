// =============================================================================
// SINGLE SOURCE OF TRUTH — edit here to add topics, stages, or change labels.
// Everything else (filters, graph, validation, scripts) derives from this file.
// =============================================================================

// --- Topics ---
// To add a new topic:
//   1. Add a key here (e.g. `economics: {}` or `economics: { label: "Economics" }`)
//   2. Add a CSS color variable in globals.css:  --color-topic-economics: #hex;
//   3. Add Tailwind hover class in NoteCard.tsx: economics: "hover:border-topic-economics/40"
//   4. Add legend entry in src/app/graph/page.tsx if you want it in the graph legend
// Label defaults to the capitalized key if not provided.
const TOPIC_CONFIG = {
  crypto: { label: "Blockchain & Crypto" },
  psychology: {},
  philosophy: {},
  technology: {},
  history: {},
  "self-growth": { label: "Personal Growth" },
  uncategorized: {},
} as const;

export type Topic = keyof typeof TOPIC_CONFIG;
export const VALID_TOPICS = Object.keys(TOPIC_CONFIG) as Topic[];

// --- Maturity stages ---
// Describes how developed a note is. Use seedling for new ideas, evergreen for polished ones.
export const VALID_STAGES = ["seedling", "budding", "evergreen"] as const;
export type MaturityStage = (typeof VALID_STAGES)[number];

// Shape of the YAML frontmatter at the top of every .mdx note file.
export interface NoteFrontmatter {
  title: string;
  date: string;
  updated?: string; // set when you significantly revise an existing note
  stage: MaturityStage;
  topic: Topic;
  tags: string[];
  connections: string[]; // slugs of other notes to link manually, e.g. "crypto/bitcoin"
}

// A fully parsed note — frontmatter + raw MDX content + computed reading time.
export interface Note {
  slug: string; // e.g. "crypto/bitcoin-basics" (path relative to content/notes/)
  frontmatter: NoteFrontmatter;
  content: string; // raw MDX body (everything below the --- separator)
  readingTime: string; // e.g. "3 min read", computed by the reading-time library
}

export interface LogEntry {
  slug: string; // filename without .mdx, typically a date like "2026-04-01"
  date: string;
  content: string;
}

// --- Graph types (passed directly to react-force-graph-2d) ---
export interface GraphNode {
  id: string; // note slug
  name: string; // note title, shown as a label when zoomed in
  topic: Topic;
  stage: MaturityStage;
  val: number; // node size — grows with connection count (see lib/graph.ts)
}

export interface GraphLink {
  source: string; // slug
  target: string; // slug
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Lightweight shape stored in public/search-index.json at build time.
// The SearchBar loads this file at runtime for client-side fuzzy search.
export interface SearchIndexEntry {
  slug: string;
  title: string;
  topic: Topic;
  stage: MaturityStage;
  tags: string[];
  excerpt: string;
}

export interface TagWithCount {
  tag: string;
  count: number;
  notes: string[]; // slugs of notes that use this tag
}

export const TOPIC_COLORS = Object.fromEntries(
  VALID_TOPICS.map((t) => [t, `var(--color-topic-${t})`]),
) as Record<Topic, string>;

export const TOPIC_LABELS = Object.fromEntries(
  VALID_TOPICS.map((t) => [
    t,
    (TOPIC_CONFIG[t] as { label?: string }).label ||
      t.charAt(0).toUpperCase() + t.slice(1),
  ]),
) as Record<Topic, string>;

export const STAGE_META: Record<
  MaturityStage,
  { emoji: string; label: string }
> = {
  seedling: { emoji: "🌱", label: "Seedling" },
  budding: { emoji: "🌿", label: "Budding" },
  evergreen: { emoji: "🌳", label: "Evergreen" },
};
