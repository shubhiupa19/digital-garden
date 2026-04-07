"use client";

import { useRouter } from "next/navigation";
import GraphVisualization from "./GraphVisualization";
import type { GraphData } from "@/types/content";

// Shared client wrapper used by both the home page (preview) and the full graph page.
// containerClassName lets the caller control sizing — the home page uses a fixed
// height box; the graph page fills the full viewport.
export default function GraphWrapper({
  graphData,
  containerClassName,
}: {
  graphData: GraphData;
  containerClassName?: string;
}) {
  const router = useRouter();

  return (
    <div className={containerClassName}>
      <GraphVisualization
        graphData={graphData}
        onNodeClick={(slug) => router.push(`/notes/${slug}`)}
      />
    </div>
  );
}
