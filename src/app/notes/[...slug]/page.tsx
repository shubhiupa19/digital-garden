import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getNoteBySlug, getNoteSlugs, getConnectedNotes } from "@/lib/content";
import MaturityBadge from "@/components/MaturityBadge";
import TopicPill from "@/components/TopicPill";
import ConnectionsList from "@/components/ConnectionsList";
import Link from "next/link";

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <article className="animate-fade-in">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TopicPill topic={note.frontmatter.topic} />
            <MaturityBadge stage={note.frontmatter.stage} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-text-primary mb-3 tracking-tight font-serif">
            {note.frontmatter.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
            <span>{dateStr}</span>
            {updatedStr && updatedStr !== dateStr && (
              <>
                <span className="text-text-muted/50">·</span>
                <span>Updated {updatedStr}</span>
              </>
            )}
            <span className="text-text-muted/50">·</span>
            <span>{note.readingTime}</span>
          </div>

          {note.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.frontmatter.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags?t=${encodeURIComponent(tag)}`}
                  className="text-xs text-text-muted bg-surface border border-border rounded-md px-2 py-1 hover:border-border-hover hover:text-text-primary transition-colors"
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
        <div className="mt-12 pt-6 border-t border-border">
          <Link
            href="/notes"
            className="text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            ← Back to all notes
          </Link>
        </div>
      </article>
    </div>
  );
}
