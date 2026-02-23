import type { MaturityStage } from "@/types/content";
import { STAGE_META } from "@/types/content";

const stageStyles: Record<MaturityStage, string> = {
  seedling:
    "bg-stage-seedling/10 text-stage-seedling border border-dashed border-stage-seedling/30",
  budding:
    "bg-stage-budding/10 text-stage-budding border border-stage-budding/30",
  evergreen:
    "bg-stage-evergreen/10 text-stage-evergreen border border-stage-evergreen/40 font-semibold",
};

export default function MaturityBadge({
  stage,
  size = "md",
}: {
  stage: MaturityStage;
  size?: "sm" | "md";
}) {
  const meta = STAGE_META[stage];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${stageStyles[stage]} ${sizeClass}`}
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
