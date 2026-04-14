import type { Topic } from "@/types/content";
import { TOPIC_LABELS } from "@/types/content";

// Background and text colors per topic for washi-tape style badges
const topicStyles: Record<Topic, { bg: string; color: string }> = {
  crypto:         { bg: "var(--color-mustard-light)", color: "var(--color-mustard)" },
  psychology:     { bg: "var(--color-rust-light)",    color: "var(--color-rust)" },
  philosophy:     { bg: "var(--color-mauve-light)",   color: "var(--color-mauve)" },
  technology:     { bg: "var(--color-sky-light)",     color: "var(--color-sky)" },
  history:        { bg: "var(--color-olive-light)",   color: "var(--color-olive)" },
  "self-growth":  { bg: "var(--color-rose-light)",    color: "var(--color-rose)" },
  uncategorized:  { bg: "var(--color-checker-2)",     color: "var(--color-text-muted)" },
};

// Solid accent color per topic (for the card top strip)
export const topicStripColor: Record<Topic, string> = {
  crypto:        "var(--color-mustard)",
  psychology:    "var(--color-rust)",
  philosophy:    "var(--color-mauve)",
  technology:    "var(--color-sky)",
  history:       "var(--color-olive)",
  "self-growth": "var(--color-rose)",
  uncategorized: "var(--color-text-faint)",
};

export default function TopicPill({ topic }: { topic: Topic }) {
  const { bg, color } = topicStyles[topic];
  return (
    <span
      className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded"
      style={{ background: bg, color }}
    >
      {TOPIC_LABELS[topic]}
    </span>
  );
}
