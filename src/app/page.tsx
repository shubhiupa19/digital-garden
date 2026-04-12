import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllNotes, getMarkdownContent } from "@/lib/content";
import { buildGraphData } from "@/lib/graph";
import { buildSearchIndex } from "@/lib/search";
import GraphWrapper from "@/components/GraphWrapper";
import HomeClient from "@/components/HomeClient";
import fs from "fs";
import path from "path";

const MDX_OPTIONS = { mdxOptions: { remarkPlugins: [remarkGfm] } };

export default async function HomePage() {
  const notes = await getAllNotes();
  const graphData = await buildGraphData(notes);
  const changelogRaw = await getMarkdownContent("changelog.md");
  const questionsRaw = await getMarkdownContent("questions.md");

  // Write search index at build time
  const searchIndex = buildSearchIndex(notes);
  fs.writeFileSync(
    path.join(process.cwd(), "public", "search-index.json"),
    JSON.stringify(searchIndex)
  );

  // Compile changelog preview (first ~10 lines)
  const changelogContent = changelogRaw
    ? await compileMDX({
        source: changelogRaw.split("\n").slice(0, 10).join("\n"),
        options: MDX_OPTIONS,
      }).then((r) => r.content)
    : null;

  // Parse questions bullets from markdown
  const questions = questionsRaw
    ? questionsRaw
        .split("\n")
        .filter((l) => l.trim().startsWith("-"))
        .map((l) => l.replace(/^-\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background: "var(--color-surface)",
          borderBottom: "2px solid var(--color-border)",
          padding: "64px 48px 56px",
        }}
      >
        <div className="max-w-2xl mx-auto relative">
          {/* Washi label */}
          <div className="mb-5">
            <span className="washi olive">Welcome to my garden</span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif italic font-medium leading-snug mb-5 animate-fade-in"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              color: "var(--color-text-primary)",
            }}
          >
            A living collection of ideas, notes, and half-formed thoughts.
          </h1>

          {/* Description */}
          <p
            className="text-base leading-relaxed max-w-lg mx-auto animate-slide-up"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Not a blog — a space for thinking out loud. I write about crypto,
            psychology, philosophy, and technology. Things here are always
            growing, changing, and connecting to each other.
          </p>

          {/* Decorative stamps */}
          <div
            className="absolute top-0 right-0 hidden sm:block"
            style={{ transform: "rotate(6deg)" }}
          >
            <span className="stamp" style={{ color: "var(--color-rust)" }}>
              Learning in public
            </span>
          </div>
          <div
            className="absolute bottom-0 left-0 hidden sm:block"
            style={{ transform: "rotate(-4deg)" }}
          >
            <span className="stamp" style={{ color: "var(--color-olive)" }}>
              Est. 2026
            </span>
          </div>
        </div>
      </section>

      {/* ── CHECKER ── */}
      <div className="checker-strip olive" />

      {/* ── GROWTH LEGEND ── */}
      <div
        className="flex justify-center gap-8 flex-wrap px-4 py-4"
        style={{
          background: "var(--color-parchment)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        {[
          { emoji: "🌱", label: "Seedling — just planted" },
          { emoji: "🌿", label: "Budding — growing" },
          { emoji: "🌳", label: "Evergreen — fully formed" },
        ].map(({ emoji, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span
              className="font-serif italic text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── NOTES (client: filter tabs + grid) ── */}
      <HomeClient notes={notes} />

      {/* ── CHECKER ── */}
      <div className="checker-strip rust" />

      {/* ── STILL FIGURING OUT ── */}
      {questions.length > 0 && (
        <section
          style={{
            background: "var(--color-parchment)",
            borderTop: "2px solid var(--color-border)",
            borderBottom: "2px solid var(--color-border)",
            padding: "64px 48px",
          }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2
                className="font-serif font-medium italic"
                style={{
                  fontSize: "1.8rem",
                  color: "var(--color-text-primary)",
                }}
              >
                Still Figuring Out
              </h2>
              <span className="washi mauve">Open Questions</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {questions.map((q, i) => (
                <div key={i} className="q-card">
                  <p
                    className="font-serif italic leading-snug text-lg"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    &ldquo;{q}&rdquo;
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/questions"
                className="text-sm font-bold uppercase tracking-wider transition-colors"
                style={{ color: "var(--color-text-muted)" }}
              >
                See all open questions →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CHECKER ── */}
      <div className="checker-strip mauve" />

      {/* ── KNOWLEDGE GRAPH ── */}
      {graphData.nodes.length > 0 && (
        <section className="text-center px-4 sm:px-12 py-16">
          <h2
            className="font-serif font-medium italic mb-2"
            style={{ fontSize: "1.8rem", color: "var(--color-text-primary)" }}
          >
            Knowledge Graph
          </h2>
          <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
            How ideas connect across topics
          </p>
          <div
            className="max-w-3xl mx-auto overflow-hidden"
            style={{
              border: "2px solid var(--color-text-primary)",
              borderRadius: "10px",
              height: "300px",
            }}
          >
            <GraphWrapper
              graphData={graphData}
              containerClassName="h-full w-full"
            />
          </div>
          <div className="mt-6">
            <Link href="/graph" className="garden-cta">
              Explore Full Graph →
            </Link>
          </div>
        </section>
      )}

      {/* ── CHECKER ── */}
      <div className="checker-strip" />

      {/* ── CHANGELOG ── */}
      {changelogContent && (
        <section className="max-w-4xl mx-auto px-4 sm:px-12 py-16">
          <div className="flex items-center gap-4 mb-7">
            <h2
              className="font-serif font-medium italic"
              style={{ fontSize: "1.8rem", color: "var(--color-text-primary)" }}
            >
              Changelog
            </h2>
            <span className="washi olive">What&apos;s New</span>
          </div>
          <div className="prose">{changelogContent}</div>
          <div className="mt-6">
            <Link
              href="/changelog"
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Full changelog →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
