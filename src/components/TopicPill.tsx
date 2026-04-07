import type { Topic } from "@/types/content";
import { TOPIC_LABELS } from "@/types/content";

// Tailwind class strings must be complete literals — Tailwind can't detect
// dynamically constructed strings like `bg-topic-${topic}/10`.
// If you add a new topic in types/content.ts, add its style entry here too.
const topicStyles: Record<Topic, string> = {
  crypto: "bg-topic-crypto/10 text-topic-crypto",
  psychology: "bg-topic-psychology/10 text-topic-psychology",
  philosophy: "bg-topic-philosophy/10 text-topic-philosophy",
  technology: "bg-topic-technology/10 text-topic-technology",
  history: "bg-topic-history/10 text-topic-history",
  "self-growth": "bg-topic-self-growth/10 text-topic-self-growth",
  uncategorized: "bg-topic-uncategorized/10 text-topic-uncategorized",
};

export default function TopicPill({ topic }: { topic: Topic }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${topicStyles[topic]}`}
    >
      {TOPIC_LABELS[topic]}
    </span>
  );
}
