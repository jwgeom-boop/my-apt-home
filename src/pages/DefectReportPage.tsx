import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { defectCategories, checkUrgency, type SubCategory } from "@/data/defectCategories";
import CategorySelector from "@/components/defect/CategorySelector";
import InspectionChecklist from "@/components/defect/InspectionChecklist";
import { supabase } from "@/integrations/supabase/client";
import type { PhotoItem } from "@/components/defect/PhotoCapture";

interface SubmittedDefect {
  id: string;
  location: string;
  guide: string;
  isUrgent: boolean;
  photoCount: number;
  status: string;
}

const DefectReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedMid, setSelectedMid] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);

  const [issueGuides, setIssueGuides] = useState<Set<string>>(new Set());
  const [guidePhotos, setGuidePhotos] = useState<Record<string, PhotoItem[]>>({});

  const [submittedDefects, setSubmittedDefects] = useState<SubmittedDefect[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [residentId, setResidentId] = useState<string | null>(null);

  // 입주자 ID 및 기존 접수 내역 로드
  useEffect(() => {
    const loadData = async () => {
      // 데모용: 첫 번째 입주자
      const { data: resident } = await supabase
        .from("residents")
        .select("id")
        .limit(1)
        .single();

      if (resident) {
        setResidentId(resident.id);

        // 기존 접수 내역 로드
        const { data: defects } = await supabase
          .from("defects")
          .select("*")
          .eq("resident_id", resident.id)
          .order("created_at", { ascending: false });

        if (defects) {
          setSubmittedDefects(
            defects.map((d) => ({
              id: d.receipt_no,
              location: d.location,
              guide: d.guide_items.join(", "),
              isUrgent: d.is_urgent,
              photoCount: d.photo_count,
              status: d.status,
            }))
          );
        }
      }
    };
    loadData();
  }, []);

  const isUrgent = currentSubCategory
    ? checkUrgency(currentSubCategory, Array.from(issueGuides))
    : false;

  const handleSelectMain = (name: string) => {
    setSelectedMain(name);
    setSelectedMid("");
    setSelectedSub("");
    setCurrentSubCategory(null);
    setIssueGuides(new Set());
    setGuidePhotos({});
  };

  const handleSelectMid = (name: string) => {
    setSelectedMid(name);
    setSelectedSub("");
    setCurrentSubCategory(null);
    setIssueGuides(new Set());
    setGuidePhotos({});
  };

  const handleSelectSub = (sub: SubCategory) => {
    setSelectedSub(sub.name);
    setCurrentSubCategory(sub);
    setIssueGuides(new Set());
    setGuidePhotos({});
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
    photo.memo = guide;
    setGuidePhotos((prev) => ({
      ...prev,
      [guide]: [...(prev[guide] || []), photo],
    }));
  };

  const locationLabel = selectedMain && selectedSub ? `${selectedMain} > ${selectedMid} > ${selectedSub}` : "";
  const locationField = selectedMain && selectedSub ? `${selectedMain} - ${selectedSub}` : "";
  const hasValidIssues = Array.from(issueGuides).some((g) => (guidePhotos[g]?.length || 0) > 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    const receiptNo = `HD-${Date.now().toString().slice(-6)}`;
    const totalPhotos = Object.values(guidePhotos).reduce((s, arr) => s + arr.length, 0);
    const guideItemsArr = Array.from(issueGuides);

    // 사진 메타데이터 (dataUrl은 용량이 크므로 메타만 저장)
    const photoMeta = Object.entries(guidePhotos).flatMap(([guide, photos]) =>
      photos.map((p) => ({
        guide,
        memo: p.memo,
        timestamp: p.timestamp,
        gps: p.gps,
      }))
    );

    const { error } = await supabase.from("defects").insert({
      resident_id: residentId,
      receipt_no: receiptNo,
      location: locationField,
      mid_category: selectedMid,
      guide_items: guideItemsArr,
      photo_count: totalPhotos,
      photo_data: photoMeta,
      is_urgent: isUrgent,
      status: "미배정",
    });

    setSubmitting(false);

    if (error) {
      console.error("하자 접수 저장 실패:", error);
      toast({
        title: "❌ 접수 실패",
        description: "저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      return;
    }

    const defect: SubmittedDefect = {
      id: receiptNo,
      location: locationField,
      guide: guideItemsArr.join(", "),
      isUrgent,
      photoCount: totalPhotos,
      status: "미배정",
    };
    setSubmittedDefects((prev) => [defect, ...prev]);

    toast({
      title: isUrgent ? "🚨 긴급 하자 접수 완료!" : "✅ 하자 접수 완료!",
      description: `접수번호 ${receiptNo} | ${locationField} | DB에 저장되었습니다.`,
    });

    setCurrentSubCategory(null);
    setSelectedSub("");
    setIssueGuides(new Set());
    setGuidePhotos({});
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-8">하자 접수</h1>
        {isUrgent && (
          <span className="absolute right-4 flex items-center gap-1 text-destructive text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> 긴급
          </span>
        )}
      </header>

      <div className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 overflow-y-auto">
        {/* Session count */}
        {submittedDefects.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-foreground">📋 전체 접수: {submittedDefects.length}건</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">DB에 저장된 접수 내역입니다</p>
            </div>
            <span className="text-lg font-bold text-primary">{submittedDefects.length}</span>
          </div>
        )}

        {/* Inline Category Selector */}
        <CategorySelector
          categories={defectCategories}
          selectedMain={selectedMain}
          selectedMid={selectedMid}
          selectedSub={selectedSub}
          onSelectMain={handleSelectMain}
          onSelectMid={handleSelectMid}
          onSelectSub={handleSelectSub}
        />

        {/* Inspection checklist */}
        {currentSubCategory && (
          <div className="animate-fade-in">
            <InspectionChecklist
              guides={currentSubCategory.guides}
              issueGuides={issueGuides}
              onToggleIssue={toggleIssue}
              locationLabel={locationLabel}
              guidePhotos={guidePhotos}
              onCaptureGuidePhoto={handleCaptureGuidePhoto}
            />
          </div>
        )}

        {/* Submitted defects */}
        {submittedDefects.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">📝 접수 내역</h3>
            <div className="space-y-2">
              {submittedDefects.map((d) => (
                <div
                  key={d.id}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg border text-xs",
                    d.isUrgent ? "bg-destructive/5 border-destructive/20" : "bg-primary/5 border-primary/20"
                  )}
                >
                  <div>
                    <span className="font-bold text-foreground">{d.location}</span>
                    <span className="text-muted-foreground ml-2">📷 {d.photoCount}장</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground">{d.status}</span>
                    <span className={cn(
                      "font-bold text-[10px] px-2 py-0.5 rounded-full",
                      d.isUrgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                      {d.isUrgent ? "🚨 긴급" : "접수됨 ✓"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex gap-3 z-50">
        {issueGuides.size > 0 && currentSubCategory ? (
          <>
            <Button
              variant="outline"
              onClick={() => { setCurrentSubCategory(null); setSelectedSub(""); setIssueGuides(new Set()); setGuidePhotos({}); }}
              className="flex-1 h-14 rounded-xl text-base"
            >
              ← 목록으로
            </Button>
            <Button
              disabled={!hasValidIssues || submitting}
              onClick={handleSubmit}
              className={cn(
                "flex-1 h-14 rounded-xl text-base font-bold",
                isUrgent && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              )}
            >
              {submitting ? "저장 중..." : isUrgent ? "🚨 긴급 접수" : "접수하기"}
            </Button>
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
