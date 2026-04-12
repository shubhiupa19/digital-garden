"use client";

import { useState } from "react";
import type { Note, Topic } from "@/types/content";
import { TOPIC_LABELS, VALID_TOPICS } from "@/types/content";
import NoteCard from "./NoteCard";
import Link from "next/link";

const topicTabHover: Record<Topic | "all", { bg: string; border: string; color: string }> = {
  all:           { bg: "transparent",                   border: "var(--color-text-primary)", color: "var(--color-text-primary)" },
  crypto:        { bg: "var(--color-mustard-bg)",        border: "var(--color-mustard-light)",color: "var(--color-mustard)" },
  psychology:    { bg: "var(--color-rust-bg)",           border: "var(--color-rust-light)",   color: "var(--color-rust)" },
  philosophy:    { bg: "var(--color-mauve-bg)",          border: "var(--color-mauve-light)",  color: "var(--color-mauve)" },
  technology:    { bg: "var(--color-sky-bg)",            border: "var(--color-sky-light)",    color: "var(--color-sky)" },
  history:       { bg: "var(--color-olive-bg)",          border: "var(--color-olive-light)",  color: "var(--color-olive)" },
  "self-growth": { bg: "var(--color-olive-bg)",          border: "var(--color-olive-light)",  color: "var(--color-olive)" },
  uncategorized: { bg: "var(--color-checker-2)",         border: "var(--color-checker-1)",    color: "var(--color-text-muted)" },
};

export default function HomeClient({ notes }: { notes: Note[] }) {
  const [active, setActive] = useState<Topic | "all">("all");
  const [hovered, setHovered] = useState<Topic | "all" | null>(null);

  const filtered = active === "all" ? notes : notes.filter((n) => n.frontmatter.topic === active);

  // Get topics that actually have notes
  const usedTopics = VALID_TOPICS.filter((t) => notes.some((n) => n.frontmatter.topic === t));

  function tabStyle(key: Topic | "all") {
    const isActive = active === key;
    const isHovered = hovered === key;
    if (isActive) {
      return {
        background: "var(--color-text-primary)",
        color: "var(--color-surface)",
        borderColor: "var(--color-text-primary)",
      };
    }
    if (isHovered) {
      const h = topicTabHover[key];
      return { background: h.bg, borderColor: h.border, color: h.color };
    }
    return {
      background: "var(--color-surface)",
      color: "var(--color-text-secondary)",
      borderColor: "var(--color-checker-1)",
    };
  }

  return (
    <>
      {/* Filter tabs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-12 pt-10 pb-8">
        <p
          className="font-serif italic text-sm mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Browse by topic:
        </p>
        <div className="flex flex-wrap gap-2">
          {(["all", ...usedTopics] as (Topic | "all")[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded border-2 transition-all duration-200 cursor-pointer"
              style={tabStyle(key)}
            >
              {key === "all" ? "All" : TOPIC_LABELS[key as Topic]}
            </button>
          ))}
        </div>
      </section>

      {/* Notes grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-12 pb-20">
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>
        ) : (
          <p className="text-center py-12" style={{ color: "var(--color-text-muted)" }}>
            No notes in this topic yet.
          </p>
        )}
        <div className="text-center mt-10">
          <Link
            href="/notes"
            className="inline-block text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded border-2 transition-all duration-200"
            style={{
              color: "var(--color-text-primary)",
              borderColor: "var(--color-text-primary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--color-text-primary)";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-surface)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "3px 3px 0 var(--color-olive)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text-primary)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            Browse All Notes →
          </Link>
        </div>
      </section>
    </>
  );
}
