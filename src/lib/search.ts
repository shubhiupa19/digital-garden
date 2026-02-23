import type { Note, SearchIndexEntry } from "@/types/content";

export function buildSearchIndex(notes: Note[]): SearchIndexEntry[] {
  return notes.map((note) => ({
    slug: note.slug,
    title: note.frontmatter.title,
    topic: note.frontmatter.topic,
    stage: note.frontmatter.stage,
    tags: note.frontmatter.tags,
    excerpt: note.content
      .replace(/^---[\s\S]*?---/, "")
      .replace(/[#*`>\[\]()_~]/g, "")
      .trim()
      .slice(0, 200),
  }));

  /*
   * FUTURE: Semantic Search Integration Point
   *
   * To upgrade from fuzzy search to semantic search:
   *
   * 1. Install dependencies:
   *    npm install @pinecone-database/pinecone openai
   *
   * 2. Generate embeddings at build time:
   *    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   *    for (const note of notes) {
   *      const embedding = await openai.embeddings.create({
   *        model: 'text-embedding-3-small',
   *        input: `${note.frontmatter.title} ${note.frontmatter.tags.join(' ')} ${note.content}`,
   *      });
   *      await pineconeIndex.upsert([{
   *        id: note.slug,
   *        values: embedding.data[0].embedding,
   *        metadata: { title: note.frontmatter.title, topic: note.frontmatter.topic },
   *      }]);
   *    }
   *
   * 3. Create an API route for search at /app/api/search/route.ts:
   *    - Accept query string
   *    - Generate query embedding with OpenAI
   *    - Query Pinecone for top-K similar vectors
   *    - Return matched note slugs with similarity scores
   *
   * 4. Update SearchBar.tsx to call the API instead of client-side filtering
   */
}

export function searchNotes(
  query: string,
  index: SearchIndexEntry[]
): SearchIndexEntry[] {
  if (!query.trim()) return [];

  const terms = query.toLowerCase().split(/\s+/);

  const scored = index
    .map((entry) => {
      const titleLower = entry.title.toLowerCase();
      const tagsLower = entry.tags.map((t) => t.toLowerCase());
      const excerptLower = entry.excerpt.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (titleLower.includes(term)) score += 10;
        if (tagsLower.some((t) => t.includes(term))) score += 5;
        if (excerptLower.includes(term)) score += 2;
      }

      return { entry, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 20).map((s) => s.entry);

  /*
   * FUTURE: Replace the above with semantic search:
   *
   * const response = await fetch('/api/search', {
   *   method: 'POST',
   *   body: JSON.stringify({ query }),
   * });
   * const { results } = await response.json();
   * return results;
   */
}
