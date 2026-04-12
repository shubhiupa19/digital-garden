import Link from "next/link";
import type { Note } from "@/types/content";
import MaturityBadge from "./MaturityBadge";
import TopicPill, { topicStripColor } from "./TopicPill";

export default function NoteCard({ note }: { note: Note }) {
  const excerpt = note.content
    .replace(/[#*`>\[\]()_~]/g, "")
    .trim()
    .slice(0, 160);

  const strip = topicStripColor[note.frontmatter.topic];
  const dateStr = new Date(note.frontmatter.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/notes/${note.slug}`} className="block group">
      <article
        className="flex flex-col overflow-hidden transition-all duration-300"
        style={{
          background: "var(--color-surface)",
          border: "2px solid var(--color-text-primary)",
          borderRadius: "10px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "4px 4px 0 var(--color-parchment)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Colored top strip */}
        <div style={{ height: "6px", background: strip, flexShrink: 0 }} />

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Top row: topic badge + maturity */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <TopicPill topic={note.frontmatter.topic} />
            <MaturityBadge stage={note.frontmatter.stage} size="sm" />
          </div>

          {/* Title */}
          <h3
            className="font-serif text-xl font-medium leading-snug mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {note.frontmatter.title}
          </h3>

          {/* Excerpt */}
          <p
            className="text-sm leading-relaxed mb-4 flex-1 line-clamp-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            {excerpt}
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "2px dashed var(--color-border)" }}
          >
            <div className="flex flex-wrap gap-2">
              {note.frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  #{tag}
                </span>
              ))}
              {note.frontmatter.tags.length > 3 && (
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--color-text-faint)" }}
                >
                  +{note.frontmatter.tags.length - 3}
                </span>
              )}
            </div>
            <span className="font-mono text-xs" style={{ color: "var(--color-text-faint)" }}>
              {dateStr} · {note.readingTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
