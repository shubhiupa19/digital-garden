"use client";

import { useState, useMemo } from "react";
import type { Note, Topic, MaturityStage, TagWithCount } from "@/types/content";
import { TOPIC_LABELS, STAGE_META, VALID_TOPICS, VALID_STAGES } from "@/types/content";
import TagPill from "./TagPill";

interface Props {
  notes: Note[];
  allTags: TagWithCount[];
  children: (filtered: Note[]) => React.ReactNode;
}

const topics: Topic[] = VALID_TOPICS;
const stages: MaturityStage[] = [...VALID_STAGES];

export default function FilterPanel({ notes, allTags, children }: Props) {
  const [selectedTopics, setSelectedTopics] = useState<Set<Topic>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedStages, setSelectedStages] = useState<Set<MaturityStage>>(new Set());
  const [tagSearch, setTagSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return notes.filter((note) => {
      if (selectedTopics.size > 0 && !selectedTopics.has(note.frontmatter.topic)) return false;
      if (selectedStages.size > 0 && !selectedStages.has(note.frontmatter.stage)) return false;
      if (selectedTags.size > 0 && !note.frontmatter.tags.some((t) => selectedTags.has(t.toLowerCase()))) return false;
      return true;
    });
  }, [notes, selectedTopics, selectedTags, selectedStages]);

  const filteredTags = useMemo(() => {
    if (!tagSearch) return allTags.slice(0, 30);
    return allTags.filter((t) => t.tag.includes(tagSearch.toLowerCase()));
  }, [allTags, tagSearch]);

  function toggleTopic(t: Topic) {
    setSelectedTopics((prev) => { const next = new Set(prev); if (next.has(t)) next.delete(t); else next.add(t); return next; });
  }
  function toggleTag(t: string) {
    setSelectedTags((prev) => { const next = new Set(prev); if (next.has(t)) next.delete(t); else next.add(t); return next; });
  }
  function toggleStage(s: MaturityStage) {
    setSelectedStages((prev) => { const next = new Set(prev); if (next.has(s)) next.delete(s); else next.add(s); return next; });
  }

  const hasFilters = selectedTopics.size > 0 || selectedTags.size > 0 || selectedStages.size > 0;
  function clearAll() { setSelectedTopics(new Set()); setSelectedTags(new Set()); setSelectedStages(new Set()); }

  const sidebar = (
    <div className="space-y-6">
      {/* Topics */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Topics
        </h3>
        <div className="space-y-2">
          {topics.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTopics.has(t)}
                onChange={() => toggleTopic(t)}
                className="rounded border-2"
                style={{ borderColor: "var(--color-border)", accentColor: "var(--color-text-primary)" }}
              />
              <span
                className="text-sm transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {TOPIC_LABELS[t]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Maturity */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Maturity
        </h3>
        <div className="space-y-2">
          {stages.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStages.has(s)}
                onChange={() => toggleStage(s)}
                className="rounded border-2"
                style={{ borderColor: "var(--color-border)", accentColor: "var(--color-text-primary)" }}
              />
              <span
                className="text-sm transition-colors"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {STAGE_META[s].emoji} {STAGE_META[s].label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Tags
        </h3>
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Filter tags..."
          className="w-full px-3 py-1.5 rounded text-sm focus:outline-none mb-3 border-2"
          style={{
            background: "var(--color-background)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
          {filteredTags.map((t) => (
            <TagPill
              key={t.tag}
              tag={t.tag}
              count={t.count}
              selected={selectedTags.has(t.tag)}
              onClick={() => toggleTag(t.tag)}
            />
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="md:hidden mb-4 flex items-center gap-2 text-sm transition-colors"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters {hasFilters && `(${selectedTopics.size + selectedTags.size + selectedStages.size})`}
      </button>

      {showFilters && (
        <div
          className="md:hidden mb-6 p-4 rounded-lg border-2"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {sidebar}
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20">{sidebar}</div>
        </aside>
        <div className="flex-1 min-w-0">
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            {filtered.length} {filtered.length === 1 ? "note" : "notes"}
            {hasFilters && " matching filters"}
          </p>
          {children(filtered)}
        </div>
      </div>
    </div>
  );
}
