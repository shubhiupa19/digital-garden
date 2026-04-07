/**
 * lib/graph.ts — converts notes into the node/link format that react-force-graph-2d expects.
 *
 * Nodes are colored by topic (see TOPIC_HEX in GraphVisualization.tsx).
 * Node size grows with connection count so highly-connected notes stand out.
 */

import type { Note, GraphData, GraphNode, GraphLink } from "@/types/content";
import { getAllConnections } from "./content";

export async function buildGraphData(notes: Note[]): Promise<GraphData> {
  const connections = await getAllConnections();

  // Tally how many connections each note has so we can size nodes accordingly.
  const connectionCount = new Map<string, number>();
  for (const conn of connections) {
    connectionCount.set(
      conn.source,
      (connectionCount.get(conn.source) || 0) + 1
    );
    connectionCount.set(
      conn.target,
      (connectionCount.get(conn.target) || 0) + 1
    );
  }

  const nodes: GraphNode[] = notes.map((note) => ({
    id: note.slug,
    name: note.frontmatter.title,
    topic: note.frontmatter.topic,
    stage: note.frontmatter.stage,
    // Base size 4, plus 3 per connection — a note with 5 connections has val=19.
    val: 4 + (connectionCount.get(note.slug) || 0) * 3,
  }));

  const links: GraphLink[] = connections.map((c) => ({
    source: c.source,
    target: c.target,
  }));

  return { nodes, links };
}
