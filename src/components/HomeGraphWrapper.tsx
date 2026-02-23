"use client";

import { useRouter } from "next/navigation";
import GraphVisualization from "./GraphVisualization";
import type { GraphData } from "@/types/content";

export default function HomeGraphWrapper({
  graphData,
}: {
  graphData: GraphData;
}) {
  const router = useRouter();

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-border">
      <GraphVisualization
        graphData={graphData}
        onNodeClick={(slug) => router.push(`/notes/${slug}`)}
      />
    </div>
  );
}
