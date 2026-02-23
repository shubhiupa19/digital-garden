"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GraphData, Topic } from "@/types/content";

const TOPIC_HEX: Record<Topic, string> = {
  crypto: "#22d3ee",
  psychology: "#a78bfa",
  philosophy: "#fbbf24",
  technology: "#34d399",
  uncategorized: "#9ca3af",
};

interface Props {
  graphData: GraphData;
  width?: number;
  height?: number;
  onNodeClick?: (slug: string) => void;
}

export default function GraphVisualization({
  graphData,
  width,
  height,
  onNodeClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: width || 800, h: height || 600 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ForceGraph, setForceGraph] = useState<any>(null);

  useEffect(() => {
    import("react-force-graph-2d").then((mod) => {
      setForceGraph(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (width && height) return;
    function handleResize() {
      if (containerRef.current) {
        setDimensions({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width, height]);

  const paintNode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name as string;
      const topic = node.topic as Topic;
      const size = node.val as number;
      const color = TOPIC_HEX[topic] || "#9ca3af";

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
      ctx.fillStyle = color + "33";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw label when zoomed in enough
      if (globalScale > 1.2) {
        const fontSize = Math.max(10 / globalScale, 2);
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#e5e7eb";
        ctx.fillText(label, node.x!, node.y! + size + 2);
      }
    },
    []
  );

  if (!ForceGraph) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-text-muted"
      >
        Loading graph...
      </div>
    );
  }

  if (graphData.nodes.length === 0) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center text-text-muted"
      >
        No notes to visualize yet.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <ForceGraph
        graphData={graphData}
        width={dimensions.w}
        height={dimensions.h}
        backgroundColor="#0a0f1e"
        nodeCanvasObject={paintNode}
        nodePointerAreaPaint={(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          node: any,
          color: string,
          ctx: CanvasRenderingContext2D
        ) => {
          const size = (node.val as number) || 4;
          ctx.beginPath();
          ctx.arc(node.x!, node.y!, size + 2, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={() => "#1e293b"}
        linkWidth={1}
        onNodeClick={(node: { id?: string }) => {
          if (onNodeClick && node.id) onNodeClick(node.id as string);
        }}
        cooldownTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
