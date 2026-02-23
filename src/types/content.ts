// --- Single source of truth for topics ---
// Add a new topic here and everything else updates automatically.
// Label defaults to the capitalized key if not provided.
const TOPIC_CONFIG = {
  crypto: { label: "Blockchain & Crypto" },
  psychology: {},
  philosophy: {},
  technology: {},
  uncategorized: {},
} as const;

export type Topic = keyof typeof TOPIC_CONFIG;
export const VALID_TOPICS = Object.keys(TOPIC_CONFIG) as Topic[];

// --- Single source of truth for stages ---
export const VALID_STAGES = ["seedling", "budding", "evergreen"] as const;
export type MaturityStage = (typeof VALID_STAGES)[number];

export interface NoteFrontmatter {
  title: string;
  date: string;
  updated?: string;
  stage: MaturityStage;
  topic: Topic;
  tags: string[];
  connections: string[];
}

export interface Note {
  slug: string;
  frontmatter: NoteFrontmatter;
  content: string;
  readingTime: string;
}

export interface LogEntry {
  slug: string;
  date: string;
  content: string;
}

export interface GraphNode {
  id: string;
  name: string;
  topic: Topic;
  stage: MaturityStage;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

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
  notes: string[];
}

export const TOPIC_COLORS = Object.fromEntries(
  VALID_TOPICS.map((t) => [t, `var(--color-topic-${t})`])
) as Record<Topic, string>;

export const TOPIC_LABELS = Object.fromEntries(
  VALID_TOPICS.map((t) => [
    t,
    (TOPIC_CONFIG[t] as { label?: string }).label ||
      t.charAt(0).toUpperCase() + t.slice(1),
  ])
) as Record<Topic, string>;

export const STAGE_META: Record<
  MaturityStage,
  { emoji: string; label: string }
> = {
  seedling: { emoji: "🌱", label: "Seedling" },
  budding: { emoji: "🌿", label: "Budding" },
  evergreen: { emoji: "🌳", label: "Evergreen" },
};
