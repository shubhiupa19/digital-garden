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
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border transition-colors ${
        selected
          ? "border-text-primary bg-text-primary/10 text-text-primary"
          : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span className="text-text-muted">#</span>
      {tag}
      {count !== undefined && (
        <span className="text-text-muted ml-0.5">({count})</span>
      )}
    </button>
  );
}
