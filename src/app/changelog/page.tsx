import type { Metadata } from "next";
import { getMarkdownContent } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's been added, updated, and changed in this digital garden.",
};

export default async function ChangelogPage() {
  const raw = await getMarkdownContent("changelog.md");

  if (!raw) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-12 py-12">
        <h1 className="font-serif font-medium italic mb-4" style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}>Changelog</h1>
        <p style={{ color: "var(--color-text-muted)" }}>No changelog entries yet.</p>
      </div>
    );
  }

  const { content } = await compileMDX({
    source: raw,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-12 py-12">
      <div className="flex items-center gap-4 mb-3">
        <h1 className="font-serif font-medium italic" style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}>
          Changelog
        </h1>
        <span className="washi olive">What&apos;s New</span>
      </div>
      <p className="mb-10" style={{ color: "var(--color-text-secondary)" }}>
        A running list of updates to this garden.
      </p>
      <div className="prose">{content}</div>
    </div>
  );
}
