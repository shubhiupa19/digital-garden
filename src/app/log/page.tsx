import type { Metadata } from "next";
import { getLogEntries } from "@/lib/content";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Learning Log",
  description:
    "Lightweight dated entries tracking what I'm learning day by day.",
};

async function LogEntryCard({
  entry,
}: {
  entry: { date: string; content: string };
}) {
  const { content } = await compileMDX({
    source: entry.content,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const dateStr = new Date(entry.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative pl-8 pb-10 last:pb-0">
      {/* Timeline connector */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px last:hidden" style={{ background: "var(--color-border)" }} />
      <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full border-2" style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }} />

      <div>
        <time className="font-mono text-sm" style={{ color: "var(--color-text-faint)" }}>{dateStr}</time>
        <div className="prose mt-2">{content}</div>
      </div>
    </div>
  );
}

export default async function LogPage() {
  const entries = await getLogEntries();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-12 py-12">
      <h1
        className="font-serif font-medium italic mb-2"
        style={{ fontSize: "2.2rem", color: "var(--color-text-primary)" }}
      >
        Learning Log
      </h1>
      <p className="mb-10" style={{ color: "var(--color-text-secondary)" }}>
        Lightweight notes on what I&apos;m learning.
      </p>

      {entries.length > 0 ? (
        <div className="mt-8">
          {entries.map((entry) => (
            <LogEntryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: "var(--color-text-muted)" }}>No log entries yet.</p>
      )}
    </div>
  );
}
