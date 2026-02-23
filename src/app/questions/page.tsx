import type { Metadata } from "next";
import { getMarkdownContent } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Still Figuring Out",
  description: "Open questions I'm actively exploring — uncertainty is a feature, not a bug.",
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Still Figuring Out
      </h1>
      <p className="text-text-secondary mb-10">
        Questions I&apos;m sitting with. Uncertainty is a feature, not a bug.
      </p>
      <div className="prose">{content}</div>
    </div>
  );
}
