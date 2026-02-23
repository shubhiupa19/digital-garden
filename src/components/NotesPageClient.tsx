"use client";

import type { Note, TagWithCount } from "@/types/content";
import FilterPanel from "./FilterPanel";
import NoteCard from "./NoteCard";

export default function NotesPageClient({
  notes,
  allTags,
}: {
  notes: Note[];
  allTags: TagWithCount[];
}) {
  return (
    <FilterPanel notes={notes} allTags={allTags}>
      {(filtered) => (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((note) => <NoteCard key={note.slug} note={note} />)
          ) : (
            <p className="text-text-muted col-span-2 text-center py-12">
              No notes match your filters.
            </p>
          )}
        </div>
      )}
    </FilterPanel>
  );
}
