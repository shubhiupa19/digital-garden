import type { Metadata } from "next";
import { getMarkdownContent } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Still Figuring Out",
  description:
    "Open questions I'm actively exploring — uncertainty is a feature, not a bug.",
};

export default async function QuestionsPage() {
  const raw = await getMarkdownContent("questions.md");

  if (!raw) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Still Figuring Out
        </h1>
        <p className="text-text-muted">No open questions yet.</p>
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
        <h1
          className="font-serif font-medium italic"
          style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}
        >
          Still Figuring Out
        </h1>
        <span className="washi mauve">Open Questions</span>
      </div>
      <p className="mb-10" style={{ color: "var(--color-text-secondary)" }}>
        Questions I&apos;m pondering right now.
      </p>
      <div className="prose">{content}</div>
    </div>
  );
}
