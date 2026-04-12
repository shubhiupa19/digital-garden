import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getAllNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tags",
  description: "All tags used across the digital garden, with note counts.",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  const notes = await getAllNotes();

  const notesBySlug = new Map(notes.map((n) => [n.slug, n]));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-12 py-12">
      <h1
        className="font-serif font-medium italic mb-2"
        style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}
      >
        Tags
      </h1>
      <p className="mb-10" style={{ color: "var(--color-text-secondary)" }}>
        All topics and themes across the garden. {tags.length} tags total.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tagData) => (
          <div
            key={tagData.tag}
            className="card-hover rounded-lg p-5"
            style={{ background: "var(--color-surface)", borderRadius: "10px" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-mono font-medium" style={{ color: "var(--color-text-primary)" }}>
                #{tagData.tag}
              </h2>
              <span className="font-mono text-xs" style={{ color: "var(--color-text-faint)" }}>
                {tagData.count} {tagData.count === 1 ? "note" : "notes"}
              </span>
            </div>
            <div className="space-y-1.5">
              {tagData.notes.slice(0, 5).map((slug) => {
                const note = notesBySlug.get(slug);
                if (!note) return null;
                return (
                  <Link
                    key={slug}
                    href={`/notes/${slug}`}
                    className="block text-sm font-serif italic truncate transition-colors hover:underline underline-offset-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {note.frontmatter.title}
                  </Link>
                );
              })}
              {tagData.notes.length > 5 && (
                <p className="text-xs" style={{ color: "var(--color-text-faint)" }}>
                  +{tagData.notes.length - 5} more
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-center py-12" style={{ color: "var(--color-text-muted)" }}>
          No tags yet. Add tags to your notes to see them here.
        </p>
      )}
    </div>
  );
}
