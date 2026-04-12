import Link from "next/link";
import type { Note } from "@/types/content";
import TopicPill from "./TopicPill";
import MaturityBadge from "./MaturityBadge";

function ConnectionCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200"
      style={{
        background: "var(--color-surface)",
        border: "2px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "var(--color-text-primary)";
        (e.currentTarget as HTMLAnchorElement).style.background =
          "var(--color-surface-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "var(--color-border)";
        (e.currentTarget as HTMLAnchorElement).style.background =
          "var(--color-surface)";
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium font-serif truncate"
          style={{ color: "var(--color-text-primary)" }}
        >
          {note.frontmatter.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <TopicPill topic={note.frontmatter.topic} />
          <MaturityBadge stage={note.frontmatter.stage} size="sm" />
        </div>
      </div>
    </Link>
  );
}

export default function ConnectionsList({
  manual,
  auto,
}: {
  manual: Note[];
  auto: Note[];
}) {
  if (manual.length === 0 && auto.length === 0) return null;

  return (
    <section className="mt-12 pt-8" style={{ borderTop: "2px dashed var(--color-border)" }}>
      <h2
        className="font-serif font-medium italic mb-6"
        style={{ fontSize: "1.4rem", color: "var(--color-text-primary)" }}
      >
        Connected Notes
      </h2>

      {manual.length > 0 && (
        <div className="mb-6">
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Linked directly
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {manual.map((note) => (
              <ConnectionCard key={note.slug} note={note} />
            ))}
          </div>
        </div>
      )}

      {auto.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            Related by shared tags
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {auto.map((note) => (
              <ConnectionCard key={note.slug} note={note} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
