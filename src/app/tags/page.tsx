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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Tags</h1>
      <p className="text-text-secondary mb-10">
        All topics and themes across the garden. {tags.length} tags total.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tagData) => (
          <div
            key={tagData.tag}
            className="bg-surface border border-border rounded-lg p-5 hover:border-border-hover transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-text-primary">
                #{tagData.tag}
              </h2>
              <span className="text-sm text-text-muted">
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
                    className="block text-sm text-text-secondary hover:text-text-primary transition-colors truncate"
                  >
                    {note.frontmatter.title}
                  </Link>
                );
              })}
              {tagData.notes.length > 5 && (
                <p className="text-xs text-text-muted">
                  +{tagData.notes.length - 5} more
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <p className="text-text-muted text-center py-12">
          No tags yet. Add tags to your notes to see them here.
        </p>
      )}
    </div>
  );
}
