import type { Note, GraphData, GraphNode, GraphLink } from "@/types/content";
import { getAllConnections } from "./content";

export async function buildGraphData(notes: Note[]): Promise<GraphData> {
  const connections = await getAllConnections();

  // Count connections per note for sizing
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
    val: 4 + (connectionCount.get(note.slug) || 0) * 3,
  }));

  const links: GraphLink[] = connections.map((c) => ({
    source: c.source,
    target: c.target,
  }));

  return { nodes, links };
}
