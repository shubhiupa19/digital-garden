import Link from "next/link";
import type { Note } from "@/types/content";
import MaturityBadge from "./MaturityBadge";
import TopicPill from "./TopicPill";

const topicBorderHover: Record<string, string> = {
  crypto: "hover:border-topic-crypto/40",
  psychology: "hover:border-topic-psychology/40",
  philosophy: "hover:border-topic-philosophy/40",
  technology: "hover:border-topic-technology/40",
  uncategorized: "hover:border-topic-uncategorized/40",
};

export default function NoteCard({ note }: { note: Note }) {
  const excerpt = note.content
    .replace(/[#*`>\[\]()_~]/g, "")
    .trim()
    .slice(0, 140);

  return (
    <Link href={`/notes/${note.slug}`} className="block group">
      <article
        className={`bg-surface border border-border rounded-lg p-5 transition-all duration-200 ${
          topicBorderHover[note.frontmatter.topic]
        } hover:bg-surface-hover`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <TopicPill topic={note.frontmatter.topic} />
          <MaturityBadge stage={note.frontmatter.stage} size="sm" />
        </div>

        <h3 className="text-lg font-medium text-text-primary mb-2 group-hover:underline underline-offset-2 font-serif">
          {note.frontmatter.title}
        </h3>

        <p className="text-sm text-text-muted mb-3 line-clamp-2">{excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {note.frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-text-muted bg-background rounded px-1.5 py-0.5"
              >
                #{tag}
              </span>
            ))}
            {note.frontmatter.tags.length > 3 && (
              <span className="text-xs text-text-muted">
                +{note.frontmatter.tags.length - 3}
              </span>
            )}
          </div>
          <div className="text-xs text-text-muted flex items-center gap-2">
            <span>{new Date(note.frontmatter.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            <span className="text-text-muted/50">·</span>
            <span>{note.readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
