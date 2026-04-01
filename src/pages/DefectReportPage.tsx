import { useState, useCallback } from "react";
import { ArrowLeft, Send, AlertTriangle, Home, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { defectCategories, checkUrgency, URGENT_KEYWORDS, type SubCategory } from "@/data/defectCategories";
import CategorySelector from "@/components/defect/CategorySelector";
import InspectionChecklist from "@/components/defect/InspectionChecklist";
import type { PhotoItem } from "@/components/defect/PhotoCapture";

// Submitted defect record
interface SubmittedDefect {
  id: string;
  location: string;
  guide: string;
  isUrgent: boolean;
  photoCount: number;
}

const DefectReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Category
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedMid, setSelectedMid] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);

  // Issue-based inspection
  const [issueGuides, setIssueGuides] = useState<Set<string>>(new Set());
  const [guidePhotos, setGuidePhotos] = useState<Record<string, PhotoItem[]>>({});

  // Submitted defects in this session
  const [submittedDefects, setSubmittedDefects] = useState<SubmittedDefect[]>([]);
  const [submittedSubKeys, setSubmittedSubKeys] = useState<Set<string>>(new Set());

  // View state: "select" (category) | "inspect" (guide+photo)
  const [view, setView] = useState<"select" | "inspect">("select");

  // Urgency
  const isUrgent = currentSubCategory
    ? checkUrgency(currentSubCategory, Array.from(issueGuides))
    : false;

  const handleSelectMain = (name: string) => {
    setSelectedMain(name);
    setSelectedMid("");
    setSelectedSub("");
    setCurrentSubCategory(null);
  };

  const handleSelectMid = (name: string) => {
    setSelectedMid(name);
    setSelectedSub("");
    setCurrentSubCategory(null);
  };

  const handleSelectSub = (sub: SubCategory, _midName: string) => {
    setSelectedSub(sub.name);
    setCurrentSubCategory(sub);
    setIssueGuides(new Set());
    setGuidePhotos({});
    setView("inspect");
  };

  const toggleIssue = (guide: string) => {
    setIssueGuides((prev) => {
      const next = new Set(prev);
      if (next.has(guide)) {
        next.delete(guide);
        setGuidePhotos((p) => { const n = { ...p }; delete n[guide]; return n; });
      } else {
        next.add(guide);
      }
      return next;
    });
  };

  // Watermark photo
  const addWatermark = useCallback((file: File): Promise<PhotoItem> => {
    return new Promise((resolve) => {
      const now = new Date();
      const ts = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const lat = (37.5 + Math.random() * 0.01).toFixed(6);
      const lng = (127.0 + Math.random() * 0.01).toFixed(6);
      const gpsText = `GPS ${lat}, ${lng}`;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxW = 1200;
        const scale = img.width > maxW ? maxW / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const barH = 44;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, canvas.height - barH, canvas.width, barH);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Noto Sans KR', sans-serif";
        ctx.fillText(`📅 ${ts}`, 12, canvas.height - 24);
        ctx.fillText(`📍 ${gpsText}`, 12, canvas.height - 8);
        resolve({ id: crypto.randomUUID(), dataUrl: canvas.toDataURL("image/jpeg", 0.85), memo: "", timestamp: ts, gps: gpsText });
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleCaptureGuidePhoto = async (guide: string, file: File) => {
    const photo = await addWatermark(file);
    photo.memo = guide; // auto-map guide text
    setGuidePhotos((prev) => ({
      ...prev,
      [guide]: [...(prev[guide] || []), photo],
    }));
  };

  const locationLabel = selectedMain && selectedSub ? `${selectedMain} > ${selectedMid} > ${selectedSub}` : "";
  const locationField = selectedMain && selectedSub ? `${selectedMain} - ${selectedSub}` : "";

  // Has at least one issue with photo
  const hasValidIssues = Array.from(issueGuides).some((g) => (guidePhotos[g]?.length || 0) > 0);

  const handleSubmit = () => {
    const receiptNo = `HD-${Date.now().toString().slice(-6)}`;
    const totalPhotos = Object.values(guidePhotos).reduce((s, arr) => s + arr.length, 0);

    // Record submission
    const defect: SubmittedDefect = {
      id: receiptNo,
      location: locationField,
      guide: Array.from(issueGuides).join(", "),
      isUrgent,
      photoCount: totalPhotos,
    };
    setSubmittedDefects((prev) => [...prev, defect]);
    setSubmittedSubKeys((prev) => new Set(prev).add(`${selectedMain}-${selectedMid}-${selectedSub}`));

    toast({
      title: isUrgent ? "🚨 긴급 하자 접수 완료!" : "✅ 하자 접수 완료!",
      description: `접수번호 ${receiptNo} | ${locationField} | 다른 곳도 더 점검하시겠습니까?`,
    });

    // Reset to category selection (stay on page, don't go home)
    setCurrentSubCategory(null);
    setSelectedSub("");
    setIssueGuides(new Set());
    setGuidePhotos({});
    setView("select");
  };

  const handleBackFromInspect = () => {
    setView("select");
    setCurrentSubCategory(null);
    setSelectedSub("");
    setIssueGuides(new Set());
    setGuidePhotos({});
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button
          onClick={() => view === "inspect" ? handleBackFromInspect() : navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-8">하자 접수</h1>
        {isUrgent && view === "inspect" && (
          <span className="absolute right-4 flex items-center gap-1 text-destructive text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> 긴급
          </span>
        )}
      </header>

      <div className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 overflow-y-auto">
        {/* Session submitted count */}
        {submittedDefects.length > 0 && view === "select" && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">📋 이번 점검 접수: {submittedDefects.length}건</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">접수된 항목은 표시됩니다</p>
            </div>
            <span className="text-lg font-bold text-primary">{submittedDefects.length}</span>
          </div>
        )}

        {/* View: Category Selection */}
        {view === "select" && (
          <>
            <CategorySelector
              categories={defectCategories}
              selectedMain={selectedMain}
              selectedMid={selectedMid}
              selectedSub={selectedSub}
              onSelectMain={handleSelectMain}
              onSelectMid={handleSelectMid}
              onSelectSub={handleSelectSub}
            />

            {/* Submitted defects list */}
            {submittedDefects.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <h3 className="text-sm font-bold text-foreground mb-2">📝 접수 내역</h3>
                <div className="space-y-2">
                  {submittedDefects.map((d) => (
                    <div
                      key={d.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border text-xs",
                        d.isUrgent
                          ? "bg-destructive/5 border-destructive/20"
                          : "bg-primary/5 border-primary/20"
                      )}
                    >
                      <div>
                        <span className="font-bold text-foreground">{d.location}</span>
                        <span className="text-muted-foreground ml-2">📷 {d.photoCount}장</span>
                      </div>
                      <span className={cn(
                        "font-bold text-[10px] px-2 py-0.5 rounded-full",
                        d.isUrgent
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                      )}>
                        {d.isUrgent ? "🚨 긴급" : "접수됨 ✓"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* View: Inspection */}
        {view === "inspect" && currentSubCategory && (
          <InspectionChecklist
            guides={currentSubCategory.guides}
            issueGuides={issueGuides}
            onToggleIssue={toggleIssue}
            locationLabel={locationLabel}
            guidePhotos={guidePhotos}
            onCaptureGuidePhoto={handleCaptureGuidePhoto}
          />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex gap-3 z-50">
        {view === "inspect" ? (
          <>
            <Button
              variant="outline"
              onClick={handleBackFromInspect}
              className="flex-1 h-14 rounded-xl text-base"
            >
              ← 목록으로
            </Button>
            {issueGuides.size > 0 && (
              <Button
                disabled={!hasValidIssues}
                onClick={handleSubmit}
                className={cn(
                  "flex-1 h-14 rounded-xl text-base font-bold",
                  isUrgent && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                )}
              >
                {isUrgent ? "🚨 긴급 접수" : "접수하기"}
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1 h-14 rounded-xl text-base font-bold"
          >
            <Home className="w-5 h-5 mr-2" />
            전체 점검 종료 및 홈으로
          </Button>
        )}
      </div>
    </div>
  );
};

export default DefectReportPage;
