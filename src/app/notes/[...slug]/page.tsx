import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { getNoteBySlug, getNoteSlugs, getConnectedNotes } from "@/lib/content";
import MaturityBadge from "@/components/MaturityBadge";
import TopicPill from "@/components/TopicPill";
import ConnectionsList from "@/components/ConnectionsList";
import Link from "next/link";

// [...slug] is a Next.js catch-all route — it matches any path depth under /notes/.
// e.g. /notes/crypto/bitcoin  →  params.slug = ["crypto", "bitcoin"]
// generateStaticParams tells Next.js which slugs to pre-render at build time
// so they're served as static HTML (no server needed).
export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const note = await getNoteBySlug(fullSlug);
  if (!note) return { title: "Note Not Found" };

  return {
    title: note.frontmatter.title,
    description: note.content.replace(/[#*`>\[\]()_~]/g, "").trim().slice(0, 160),
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const note = await getNoteBySlug(fullSlug);

  if (!note) notFound();

  const { manual, auto } = await getConnectedNotes(fullSlug);
  const { content } = await compileMDX({
    source: note.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]],
      },
    },
  });

  const dateStr = new Date(note.frontmatter.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedStr = note.frontmatter.updated
    ? new Date(note.frontmatter.updated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-12 py-12">
      <article className="animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TopicPill topic={note.frontmatter.topic} />
            <MaturityBadge stage={note.frontmatter.stage} />
          </div>

          <h1
            className="font-serif font-medium italic leading-tight mb-3"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              color: "var(--color-text-primary)",
            }}
          >
            {note.frontmatter.title}
          </h1>

          <div
            className="flex items-center gap-3 text-sm mb-4 font-mono"
            style={{ color: "var(--color-text-faint)" }}
          >
            <span>{dateStr}</span>
            {updatedStr && updatedStr !== dateStr && (
              <>
                <span>·</span>
                <span>Updated {updatedStr}</span>
              </>
            )}
            <span>·</span>
            <span>{note.readingTime}</span>
          </div>

          {note.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags?t=${encodeURIComponent(tag)}`}
                  className="font-mono text-xs px-2 py-1 rounded border-2 transition-colors"
                  style={{
                    color: "var(--color-text-muted)",
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose">{content}</div>

        {/* Connections */}
        <ConnectionsList manual={manual} auto={auto} />

        {/* Back link */}
        <div
          className="mt-12 pt-6"
          style={{ borderTop: "2px dashed var(--color-border)" }}
        >
          <Link
            href="/notes"
            className="text-sm font-bold uppercase tracking-wider transition-colors"
            style={{ color: "var(--color-text-muted)" }}
          >
            ← Back to all notes
          </Link>
        </div>
      </article>
    </div>
  );
}
