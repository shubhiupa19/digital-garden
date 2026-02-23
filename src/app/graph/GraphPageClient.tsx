"use client";

import { useRouter } from "next/navigation";
import GraphVisualization from "@/components/GraphVisualization";
import type { GraphData } from "@/types/content";

export default function GraphPageClient({
  graphData,
}: {
  graphData: GraphData;
}) {
  const router = useRouter();

  return (
    <GraphVisualization
      graphData={graphData}
      onNodeClick={(slug) => router.push(`/notes/${slug}`)}
    />
  );
}
