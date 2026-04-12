"use client";

export default function TagPill({
  tag,
  count,
  selected = false,
  onClick,
}: {
  tag: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs border-2 transition-colors ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={
        selected
          ? {
              background: "var(--color-text-primary)",
              borderColor: "var(--color-text-primary)",
              color: "var(--color-surface)",
            }
          : {
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
            }
      }
    >
      <span style={{ color: "var(--color-text-faint)" }}>#</span>
      {tag}
      {count !== undefined && (
        <span style={{ color: "var(--color-text-faint)" }} className="ml-0.5">
          ({count})
        </span>
      )}
    </button>
  );
}
