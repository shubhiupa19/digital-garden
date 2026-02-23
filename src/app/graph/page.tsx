import type { Metadata } from "next";
import { getAllNotes } from "@/lib/content";
import { buildGraphData } from "@/lib/graph";
import GraphPageClient from "./GraphPageClient";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description: "Explore how ideas connect across topics in this interactive knowledge graph.",
};

export default async function GraphPage() {
  const notes = await getAllNotes();
  const graphData = await buildGraphData(notes);

  return (
    <div className="h-[calc(100vh-3.5rem)] relative">
      <GraphPageClient graphData={graphData} />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-4 text-xs space-y-2 z-10">
        <p className="text-text-muted font-medium uppercase tracking-wider mb-2">Topics</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-crypto" />
          <span className="text-text-secondary">Crypto</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-psychology" />
          <span className="text-text-secondary">Psychology</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-philosophy" />
          <span className="text-text-secondary">Philosophy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-technology" />
          <span className="text-text-secondary">Technology</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-topic-uncategorized" />
          <span className="text-text-secondary">Uncategorized</span>
        </div>
        <p className="text-text-muted mt-3 pt-2 border-t border-border">
          Click a node to view the note.
          <br />
          Drag to explore.
        </p>
      </div>
    </div>
  );
}
