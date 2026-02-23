import Link from "next/link";
import type { Note } from "@/types/content";
import TopicPill from "./TopicPill";
import MaturityBadge from "./MaturityBadge";

function ConnectionCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border hover:border-border-hover hover:bg-surface-hover transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate font-serif">
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
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-xl font-medium text-text-primary mb-6 font-serif">
        Connected Notes
      </h2>

      {manual.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
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
          <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
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
