import { useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { URGENT_KEYWORDS } from "@/data/defectCategories";
import { AlertTriangle, Camera, MapPin, Search } from "lucide-react";
import type { PhotoItem } from "./PhotoCapture";
import PhotoMarkingCanvas from "./PhotoMarkingCanvas";
import NormalConstructionFAQ from "./NormalConstructionFAQ";

interface InspectionChecklistProps {
  guides: string[];
  issueGuides: Set<string>;
  onToggleIssue: (guide: string) => void;
  locationLabel: string;
  guidePhotos: Record<string, PhotoItem[]>;
  onCaptureGuidePhoto: (guide: string, file: File, photoType: "far" | "close") => void;
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
  const [activeCapture, setActiveCapture] = useState<{ guide: string; type: "far" | "close" } | null>(null);
  const [markingImage, setMarkingImage] = useState<{ guide: string; photoId: string; dataUrl: string } | null>(null);

  const handleFileChange = useCallback(
    (guide: string, photoType: "far" | "close") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onCaptureGuidePhoto(guide, file, photoType);
      e.target.value = "";
      setActiveCapture(null);
    },
    [onCaptureGuidePhoto]
  );

  const triggerCapture = (guide: string, type: "far" | "close") => {
    setActiveCapture({ guide, type });
    const key = `${guide}_${type}`;
    fileRefs.current[key]?.click();
  };

  const issueCount = guides.filter((g) => issueGuides.has(g)).length;

  const getPhotosByType = (photos: PhotoItem[], type: "far" | "close") =>
    photos.filter((p) => p.memo?.startsWith(`[${type === "far" ? "원거리" : "근거리"}]`));

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
          const farPhotos = getPhotosByType(photos, "far");
          const closePhotos = getPhotosByType(photos, "close");

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
                  <div className="flex items-start gap-1 flex-wrap">
                    <p className={cn(
                      "text-sm",
                      hasIssue ? "text-destructive font-bold" : "text-foreground"
                    )}>
                      {hasIssue ? "⚠️ " : "✅ "}
                      {guide}
                    </p>
                    <NormalConstructionFAQ guideText={guide} />
                  </div>
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

              {/* Dual photo capture */}
              {hasIssue && (
                <div className="px-3 pb-3 pt-0 space-y-2">
                  {/* Hidden file inputs */}
                  <input
                    ref={(el) => { fileRefs.current[`${guide}_far`] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange(guide, "far")}
                  />
                  <input
                    ref={(el) => { fileRefs.current[`${guide}_close`] = el; }}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange(guide, "close")}
                  />

                  {/* Two photo buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => triggerCapture(guide, "far")}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border border-dashed text-xs font-bold active:scale-[0.98] transition-all",
                        farPhotos.length > 0
                          ? "border-primary/40 bg-primary/5 text-primary"
                          : "border-primary/30 bg-primary/5 text-primary"
                      )}
                    >
                      <MapPin className="w-4 h-4" />
                      📷 위치 확인용
                      <span className="text-[10px] font-normal text-muted-foreground">(원거리)</span>
                      {farPhotos.length > 0 && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {farPhotos.length}장 ✓
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => triggerCapture(guide, "close")}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg border border-dashed text-xs font-bold active:scale-[0.98] transition-all",
                        closePhotos.length > 0
                          ? "border-destructive/40 bg-destructive/5 text-destructive"
                          : "border-destructive/30 bg-destructive/5 text-destructive"
                      )}
                    >
                      <Search className="w-4 h-4" />
                      📷 결함 상세
                      <span className="text-[10px] font-normal text-muted-foreground">(근거리)</span>
                      {closePhotos.length > 0 && (
                        <span className="text-[10px] bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                          {closePhotos.length}장 ✓
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Photo thumbnails with marking */}
                  {photos.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-1">
                      {photos.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setMarkingImage({ guide, photoId: p.id, dataUrl: p.dataUrl })}
                          className="relative shrink-0 group"
                          title="탭하여 마킹하기"
                        >
                          <img
                            src={p.dataUrl}
                            alt="defect"
                            className="w-16 h-16 rounded-lg object-cover border border-border"
                          />
                          <span className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity">
                            <span className="text-white text-[9px] font-bold">✏️ 마킹</span>
                          </span>
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] text-center py-0.5 rounded-b-lg">
                            {p.memo?.startsWith("[원거리]") ? "원거리" : "근거리"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground text-center">
                    📌 사진을 탭하면 하자 부위를 마킹할 수 있어요
                  </p>
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
          ? `⚠️ ${issueCount}건 이상 발견 — 원거리+근거리 사진 촬영 후 접수 가능`
          : "✅ 이상 없음 — 다음 항목으로 이동하세요"}
      </div>

      {/* Marking Canvas Overlay */}
      {markingImage && (
        <PhotoMarkingCanvas
          imageDataUrl={markingImage.dataUrl}
          onSave={(markedUrl) => {
            // Replace original photo with marked version
            // This is handled via parent state update
            setMarkingImage(null);
          }}
          onCancel={() => setMarkingImage(null)}
        />
      )}
    </div>
  );
};

export default InspectionChecklist;
