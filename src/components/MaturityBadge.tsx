import type { MaturityStage } from "@/types/content";
import { STAGE_META } from "@/types/content";

export default function MaturityBadge({
  stage,
  size = "md",
}: {
  stage: MaturityStage;
  size?: "sm" | "md";
}) {
  const meta = STAGE_META[stage];
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1 font-serif italic ${textSize}`}
      style={{ color: "var(--color-text-muted)" }}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
