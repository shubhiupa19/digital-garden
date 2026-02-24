import Link from "next/link";
import { getAllNotes, getMarkdownContent } from "@/lib/content";
import { buildGraphData } from "@/lib/graph";
import { buildSearchIndex } from "@/lib/search";
import NoteCard from "@/components/NoteCard";
import SearchBar from "@/components/SearchBar";
import HomeGraphWrapper from "@/components/HomeGraphWrapper";
import fs from "fs";
import path from "path";

export default async function HomePage() {
  const notes = await getAllNotes();
  const recentNotes = notes.slice(0, 6);
  const graphData = await buildGraphData(notes);
  const interests = await getMarkdownContent("interests.md");
  const changelog = await getMarkdownContent("changelog.md");

  // Generate search index at build time
  const searchIndex = buildSearchIndex(notes);
  const indexPath = path.join(process.cwd(), "public", "search-index.json");
  fs.writeFileSync(indexPath, JSON.stringify(searchIndex));

  // Parse changelog into recent entries
  const changelogLines = changelog
    ? changelog
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 10)
    : [];

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
      {interests && (
        <section className="mb-16 animate-slide-up">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Current Interests
          </h2>
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="space-y-2">
              {interests
                .split("\n")
                .reduce<string[]>((acc, line) => {
                  // Join continuation lines (indented) back to their parent bullet
                  if (line.match(/^\s+/) && acc.length > 0) {
                    acc[acc.length - 1] += " " + line.trim();
                  } else {
                    acc.push(line);
                  }
                  return acc;
                }, [])
                .map((line, i) => {
                  if (!line.trim()) return null;
                  if (line.startsWith("# ")) return null;
                  if (line.startsWith("- **")) {
                    const match = line.match(/- \*\*(.+?)\*\*(.*)$/);
                    if (match) {
                      return (
                        <p key={i} className="mb-2">
                          <strong className="text-text-primary">
                            {match[1]}
                          </strong>
                          <span className="text-text-secondary">
                            {match[2]}
                          </span>
                        </p>
                      );
                    }
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <p key={i} className="mb-2 text-text-secondary">
                        {line.slice(2)}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="mb-2 text-text-secondary">
                      {line}
                    </p>
                  );
                })}
            </div>
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
          <HomeGraphWrapper graphData={graphData} />
        </section>
      )}

      {/* Changelog */}
      {changelogLines.length > 0 && (
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
            <div className="space-y-1">
              {changelogLines.map((line, i) => {
                if (line.startsWith("## ")) {
                  return (
                    <p
                      key={i}
                      className="text-sm font-semibold text-text-primary mt-3 first:mt-0"
                    >
                      {line.replace("## ", "")}
                    </p>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <p key={i} className="text-sm text-text-secondary pl-3">
                      {line}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-sm text-text-secondary">
                    {line}
                  </p>
                );
              })}
            </div>
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
