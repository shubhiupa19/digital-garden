import type { Topic } from "@/types/content";
import { TOPIC_LABELS } from "@/types/content";

const topicStyles: Record<Topic, string> = {
  crypto: "bg-topic-crypto/10 text-topic-crypto",
  psychology: "bg-topic-psychology/10 text-topic-psychology",
  philosophy: "bg-topic-philosophy/10 text-topic-philosophy",
  technology: "bg-topic-technology/10 text-topic-technology",
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
