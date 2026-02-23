export type MaturityStage = "seedling" | "budding" | "evergreen";

export type Topic =
  | "crypto"
  | "psychology"
  | "philosophy"
  | "technology"
  | "uncategorized";

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

export const TOPIC_COLORS: Record<Topic, string> = {
  crypto: "var(--color-topic-crypto)",
  psychology: "var(--color-topic-psychology)",
  philosophy: "var(--color-topic-philosophy)",
  technology: "var(--color-topic-technology)",
  uncategorized: "var(--color-topic-uncategorized)",
};

export const TOPIC_LABELS: Record<Topic, string> = {
  crypto: "Crypto & Blockchain",
  psychology: "Psychology",
  philosophy: "Philosophy",
  technology: "Technology",
  uncategorized: "Uncategorized",
};

export const STAGE_META: Record<
  MaturityStage,
  { emoji: string; label: string }
> = {
  seedling: { emoji: "🌱", label: "Seedling" },
  budding: { emoji: "🌿", label: "Budding" },
  evergreen: { emoji: "🌳", label: "Evergreen" },
};
