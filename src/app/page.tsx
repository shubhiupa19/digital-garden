import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllNotes, getMarkdownContent } from "@/lib/content";
import { buildGraphData } from "@/lib/graph";
import { buildSearchIndex } from "@/lib/search";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import GraphWrapper from "@/components/GraphWrapper";
import fs from "fs";
import path from "path";

const MDX_OPTIONS = { mdxOptions: { remarkPlugins: [remarkGfm] } };

export default async function HomePage() {
  const notes = await getAllNotes();
  const recentNotes = notes.slice(0, 6);
  const graphData = await buildGraphData(notes);
  const interests = await getMarkdownContent("interests.md");
  const changelog = await getMarkdownContent("changelog.md");

  // Write the search index to public/ at build time so the SearchBar component
  // can fetch it at runtime with a simple GET /search-index.json. This avoids
  // needing an API route while keeping search fully functional on static hosting.
  const searchIndex = buildSearchIndex(notes);
  fs.writeFileSync(
    path.join(process.cwd(), "public", "search-index.json"),
    JSON.stringify(searchIndex)
  );

  // Compile markdown sections with MDX so they render like note content does.
  // For the changelog preview we only take the first ~15 lines (most recent entry).
  const [interestsContent, changelogContent] = await Promise.all([
    interests
      ? compileMDX({ source: interests, options: MDX_OPTIONS }).then((r) => r.content)
      : null,
    changelog
      ? compileMDX({
          source: changelog.split("\n").slice(0, 15).join("\n"),
          options: MDX_OPTIONS,
        }).then((r) => r.content)
      : null,
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="mb-16 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-medium text-text-primary mb-4 tracking-tight font-serif">
          Welcome to my
          <br />
          <span className="text-topic-crypto">digital garden</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mb-8 leading-relaxed">
          A living collection of ideas, notes, and half-formed thoughts across
          my interests spanning crypto, psychology, philosophy, and technology.
          Not really a blog, but rather a space for thinking out loud and
          connecting ideas across disciplines.
        </p>
        <SearchBar />
      </section>

      {/* Current Interests */}
      {interestsContent && (
        <section className="mb-16 animate-slide-up">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Current Interests
          </h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="prose">{interestsContent}</div>
          </div>
        </section>
      )}

      {/* Recent Notes */}
      {recentNotes.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Recent Notes
            </h2>
            <Link
              href="/notes"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentNotes.map((note) => (
              <NoteCard key={note.slug} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Graph Preview */}
      {graphData.nodes.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Knowledge Graph
            </h2>
            <Link
              href="/graph"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Explore full graph →
            </Link>
          </div>
          <GraphWrapper
            graphData={graphData}
            containerClassName="h-[400px] rounded-lg overflow-hidden border border-border"
          />
        </section>
      )}

      {/* Changelog preview */}
      {changelogContent && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-text-primary">
              Latest Updates
            </h2>
            <Link
              href="/changelog"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Full changelog →
            </Link>
          </div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="prose">{changelogContent}</div>
          </div>
        </section>
      )}

      {/* Still Figuring Out link */}
      <section className="text-center">
        <Link
          href="/questions"
          className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          See what I&apos;m still figuring out →
        </Link>
      </section>
    </div>
  );
}
