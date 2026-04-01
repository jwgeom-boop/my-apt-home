import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { URGENT_KEYWORDS } from "@/data/defectCategories";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface InspectionChecklistProps {
  guides: string[];
  checkedGuides: Set<string>;
  onToggle: (guide: string) => void;
  locationLabel: string;
}

const InspectionChecklist = ({
  guides,
  checkedGuides,
  onToggle,
  locationLabel,
}: InspectionChecklistProps) => {
  const allChecked = guides.every((g) => checkedGuides.has(g));
  const hasUrgent = guides.some((g) =>
    URGENT_KEYWORDS.some((kw) => g.includes(kw)) && checkedGuides.has(g)
  );

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">✅ 점검 가이드</h3>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {locationLabel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        아래 항목을 모두 확인해야 사진 촬영이 가능합니다
      </p>

      <div className="space-y-2">
        {guides.map((guide) => {
          const isUrgent = URGENT_KEYWORDS.some((kw) => guide.includes(kw));
          const checked = checkedGuides.has(guide);

          return (
            <label
              key={guide}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99]",
                checked
                  ? "bg-primary/5 border-primary/30"
                  : "bg-muted/20 border-border hover:border-primary/20",
                isUrgent && checked && "bg-destructive/5 border-destructive/30"
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => onToggle(guide)}
                className="shrink-0"
              />
              <span className={cn("text-sm flex-1", checked && "text-foreground font-medium", !checked && "text-muted-foreground")}>
                {guide}
              </span>
              {isUrgent && (
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              )}
              {checked && !isUrgent && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              )}
            </label>
          );
        })}
      </div>

      {/* Status */}
      <div className={cn(
        "text-xs text-center py-2 rounded-lg font-medium",
        allChecked ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"
      )}>
        {allChecked ? "✅ 모든 항목 확인 완료 — 사진 촬영 가능" : `${checkedGuides.size}/${guides.length}개 확인됨`}
      </div>

      {hasUrgent && (
        <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          긴급 하자 항목이 포함되어 있습니다
        </div>
      )}
    </div>
  );
};

export default InspectionChecklist;
