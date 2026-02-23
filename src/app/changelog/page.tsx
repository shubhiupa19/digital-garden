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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Changelog</h1>
        <p className="text-text-muted">No changelog entries yet.</p>
      </div>
    );
  }

  const { content } = await compileMDX({
    source: raw,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Changelog</h1>
      <p className="text-text-secondary mb-10">
        A running list of updates to this garden.
      </p>
      <div className="prose">{content}</div>
    </div>
  );
}
