import type { Metadata } from "next";
import { getAllNotes, getAllTags } from "@/lib/content";
import NotesPageClient from "@/components/NotesPageClient";

export const metadata: Metadata = {
  title: "All Notes",
  description: "Browse all notes in the digital garden, filterable by topic, tag, and maturity stage.",
};

export default async function NotesPage() {
  const notes = await getAllNotes();
  const allTags = await getAllTags();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-12 py-12">
      <h1
        className="font-serif font-medium italic mb-2"
        style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}
      >
        All Notes
      </h1>
      <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
        Browse, filter, and explore ideas across all topics.
      </p>
      <NotesPageClient notes={notes} allTags={allTags} />
    </div>
  );
}
