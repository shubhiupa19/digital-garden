import type { Metadata } from "next";
import { getAllNotes } from "@/lib/content";
import { buildGraphData } from "@/lib/graph";
import GraphWrapper from "@/components/GraphWrapper";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description: "Explore how ideas connect across topics in this interactive knowledge graph.",
};

export default async function GraphPage() {
  const notes = await getAllNotes();
  const graphData = await buildGraphData(notes);

  return (
    <div className="h-[calc(100vh-3.5rem)] relative">
      <GraphWrapper graphData={graphData} />

      {/* Legend — note: Tailwind requires full class strings, so these can't be
           generated dynamically. If you add a topic, add a row here too. */}
      <div
        className="absolute top-4 right-4 rounded-lg p-4 text-xs space-y-2 z-10"
        style={{
          background: "rgba(253,250,245,0.92)",
          backdropFilter: "blur(4px)",
          border: "2px solid var(--color-border)",
        }}
      >
        <p className="font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Topics</p>
        {[
          { label: "Crypto",        color: "var(--color-mustard)" },
          { label: "Psychology",    color: "var(--color-rust)" },
          { label: "Philosophy",    color: "var(--color-mauve)" },
          { label: "Technology",    color: "var(--color-sky)" },
          { label: "History",       color: "var(--color-olive)" },
          { label: "Self-growth",   color: "var(--color-olive)" },
          { label: "Uncategorized", color: "var(--color-text-faint)" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span style={{ color: "var(--color-text-secondary)" }}>{label}</span>
          </div>
        ))}
        <p
          className="mt-3 pt-2"
          style={{ color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border)" }}
        >
          Click a node to view the note.
          <br />
          Drag to explore.
        </p>
      </div>
    </div>
  );
}
