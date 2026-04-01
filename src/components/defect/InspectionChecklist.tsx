import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { URGENT_KEYWORDS } from "@/data/defectCategories";
import { AlertTriangle, CheckCircle2, Camera } from "lucide-react";
import type { PhotoItem } from "./PhotoCapture";

interface InspectionChecklistProps {
  guides: string[];
  issueGuides: Set<string>;
  onToggleIssue: (guide: string) => void;
  locationLabel: string;
  // Per-guide photo capture
  guidePhotos: Record<string, PhotoItem[]>;
  onCaptureGuidePhoto: (guide: string, file: File) => void;
}

const InspectionChecklist = ({
  guides,
  issueGuides,
  onToggleIssue,
  locationLabel,
  guidePhotos,
  onCaptureGuidePhoto,
}: InspectionChecklistProps) => {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = useCallback(
    (guide: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onCaptureGuidePhoto(guide, file);
      e.target.value = "";
    },
    [onCaptureGuidePhoto]
  );

  const issueCount = guides.filter((g) => issueGuides.has(g)).length;

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">🔍 점검 가이드</h3>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {locationLabel}
        </span>
      </div>
      <p className="text-xs text-muted-foreground -mt-1">
        각 항목을 확인하고 이상이 있으면 표시해주세요
      </p>

      <div className="space-y-2">
        {guides.map((guide) => {
          const isUrgent = URGENT_KEYWORDS.some((kw) => guide.includes(kw));
          const hasIssue = issueGuides.has(guide);
          const photos = guidePhotos[guide] || [];

          return (
            <div
              key={guide}
              className={cn(
                "rounded-xl border transition-all overflow-hidden",
                hasIssue
                  ? "bg-destructive/5 border-destructive/30"
                  : "bg-muted/10 border-border"
              )}
            >
              <div className="flex items-start gap-3 p-3">
                <div className="flex-1">
                  <p className={cn(
                    "text-sm",
                    hasIssue ? "text-destructive font-bold" : "text-foreground"
                  )}>
                    {hasIssue ? "⚠️ " : "✅ "}
                    {guide}
                  </p>
                  {isUrgent && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-destructive font-bold">
                      <AlertTriangle className="w-3 h-3" /> 긴급 항목
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onToggleIssue(guide)}
                  className={cn(
                    "shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95",
                    hasIssue
                      ? "bg-muted text-muted-foreground"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  )}
                >
                  {hasIssue ? "취소" : "이상있어요 ⚠️"}
                </button>
              </div>

              {/* Photo capture for this guide */}
              {hasIssue && (
                <div className="px-3 pb-3 pt-0">
                  <input
                    ref={(el) => { fileRefs.current[guide] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange(guide)}
                  />
                  <button
                    onClick={() => fileRefs.current[guide]?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-primary text-xs font-bold active:scale-[0.98] transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    📷 이 항목 사진 찍기
                  </button>
                  {photos.length > 0 && (
                    <div className="flex gap-2 mt-2 overflow-x-auto">
                      {photos.map((p) => (
                        <img
                          key={p.id}
                          src={p.dataUrl}
                          alt="defect"
                          className="w-16 h-16 rounded-lg object-cover border border-border shrink-0"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Status */}
      <div className={cn(
        "text-xs text-center py-2 rounded-lg font-medium",
        issueCount > 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
      )}>
        {issueCount > 0
          ? `⚠️ ${issueCount}건 이상 발견 — 사진 촬영 후 접수 가능`
          : "✅ 이상 없음 — 다음 항목으로 이동하세요"}
      </div>
    </div>
  );
};

export default InspectionChecklist;
