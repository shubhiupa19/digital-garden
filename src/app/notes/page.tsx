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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">All Notes</h1>
      <p className="text-text-secondary mb-8">
        Browse, filter, and explore ideas across all topics.
      </p>
      <NotesPageClient notes={notes} allTags={allTags} />
    </div>
  );
}
