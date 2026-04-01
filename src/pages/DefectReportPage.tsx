import { useState, useCallback } from "react";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { defectCategories, checkUrgency, type SubCategory } from "@/data/defectCategories";
import CategorySelector from "@/components/defect/CategorySelector";
import InspectionChecklist from "@/components/defect/InspectionChecklist";
import PhotoCapture, { type PhotoItem } from "@/components/defect/PhotoCapture";
import SignaturePad from "@/components/defect/SignaturePad";

const MAX_PHOTOS = 5;
const steps = ["위치선택", "점검확인", "사진촬영", "상세내용", "서명", "완료"];

const DefectReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 0: Category
  const [selectedMain, setSelectedMain] = useState("");
  const [selectedMid, setSelectedMid] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [currentSubCategory, setCurrentSubCategory] = useState<SubCategory | null>(null);

  // Step 1: Checklist
  const [checkedGuides, setCheckedGuides] = useState<Set<string>>(new Set());

  // Step 2: Photos
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Step 3: Description
  const [defectDesc, setDefectDesc] = useState("");

  // Step 4: Signature
  const [hasSigned, setHasSigned] = useState(false);

  // Urgency
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSelectMain = (name: string) => {
    setSelectedMain(name);
    setSelectedMid("");
    setSelectedSub("");
    setCurrentSubCategory(null);
    setCheckedGuides(new Set());
  };

  const handleSelectMid = (name: string) => {
    setSelectedMid(name);
    setSelectedSub("");
    setCurrentSubCategory(null);
    setCheckedGuides(new Set());
  };

  const handleSelectSub = (sub: SubCategory, _midName: string) => {
    setSelectedSub(sub.name);
    setCurrentSubCategory(sub);
    setCheckedGuides(new Set());
    setIsUrgent(sub.isUrgent || false);
  };

  const toggleGuide = (guide: string) => {
    setCheckedGuides((prev) => {
      const next = new Set(prev);
      if (next.has(guide)) next.delete(guide);
      else next.add(guide);

      // Check urgency
      if (currentSubCategory) {
        setIsUrgent(checkUrgency(currentSubCategory, Array.from(next)));
      }
      return next;
    });
  };

  const allGuidesChecked =
    currentSubCategory != null &&
    currentSubCategory.guides.length > 0 &&
    currentSubCategory.guides.every((g) => checkedGuides.has(g));

  // Photo watermark
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

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const newPhotos = await Promise.all(Array.from(files).slice(0, remaining).map((f) => addWatermark(f)));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const canNext = () => {
    if (currentStep === 0) return currentSubCategory != null;
    if (currentStep === 1) return allGuidesChecked;
    if (currentStep === 2) return photos.length > 0;
    if (currentStep === 3) return defectDesc.trim().length > 0;
    if (currentStep === 4) return hasSigned;
    return false;
  };

  const locationLabel = selectedMain && selectedSub ? `${selectedMain} > ${selectedMid} > ${selectedSub}` : "";
  const locationField = selectedMain && selectedSub ? `${selectedMain} - ${selectedSub}` : "";
  const guidesText = Array.from(checkedGuides).join(", ");

  const handleSubmit = () => {
    const receiptNo = `HD-${Date.now().toString().slice(-6)}`;
    toast({
      title: isUrgent ? "🚨 긴급 하자 접수 완료" : "하자 접수 완료",
      description: `접수번호 ${receiptNo} | 위치: ${locationField} | 상태: ${isUrgent ? "긴급" : "미배정"}`,
    });
    setCurrentStep(5);
  };

  const now = new Date();
  const timestamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} KST`;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => (currentStep > 0 && currentStep < 5 ? setCurrentStep((s) => s - 1) : navigate(-1))} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-8">하자 접수</h1>
        {isUrgent && currentStep < 5 && (
          <span className="absolute right-4 flex items-center gap-1 text-destructive text-xs font-bold">
            <AlertTriangle className="w-4 h-4" /> 긴급
          </span>
        )}
      </header>

      <div className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 overflow-y-auto">
        {/* Step Bar */}
        <div className="flex items-center justify-between px-1">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold",
                  i < currentStep ? "bg-primary text-primary-foreground" :
                  i === currentStep ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1" :
                  "bg-muted text-muted-foreground"
                )}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span className={cn("text-[9px]", i <= currentStep ? "text-primary font-semibold" : "text-muted-foreground")}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Category Selection */}
        {currentStep === 0 && (
          <CategorySelector
            categories={defectCategories}
            selectedMain={selectedMain}
            selectedMid={selectedMid}
            selectedSub={selectedSub}
            onSelectMain={handleSelectMain}
            onSelectMid={handleSelectMid}
            onSelectSub={handleSelectSub}
          />
        )}

        {/* Step 1: Inspection Checklist */}
        {currentStep === 1 && currentSubCategory && (
          <InspectionChecklist
            guides={currentSubCategory.guides}
            checkedGuides={checkedGuides}
            onToggle={toggleGuide}
            locationLabel={locationLabel}
          />
        )}

        {/* Step 2: Photo Capture */}
        {currentStep === 2 && (
          <PhotoCapture
            photos={photos}
            maxPhotos={MAX_PHOTOS}
            onCapture={handleCapture}
            onRemove={(id) => setPhotos((prev) => prev.filter((p) => p.id !== id))}
            onUpdateMemo={(id, memo) => setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, memo } : p)))}
            disabled={!allGuidesChecked}
          />
        )}

        {/* Step 3: Description */}
        {currentStep === 3 && (
          <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-foreground">하자 상세 내용</h3>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1">
              <p className="text-xs text-muted-foreground">📍 위치: {locationField}</p>
              <p className="text-xs text-muted-foreground">📷 사진: {photos.length}장</p>
              <p className="text-xs text-muted-foreground">✅ 점검: {guidesText}</p>
              {isUrgent && (
                <p className="text-xs text-destructive font-bold">🚨 긴급 하자</p>
              )}
            </div>
            <textarea
              value={defectDesc}
              onChange={(e) => setDefectDesc(e.target.value)}
              placeholder="하자 상태를 자세히 설명해 주세요..."
              rows={5}
              className="w-full text-sm bg-muted/20 border border-border rounded-lg px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
        )}

        {/* Step 4: Signature */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4">
            <div className={cn(
              "rounded-xl p-4 border",
              isUrgent ? "bg-destructive/5 border-destructive/20" : "bg-primary/5 border-primary/20"
            )}>
              <h3 className="text-sm font-bold text-foreground mb-1">접수 내용 요약</h3>
              <p className="text-xs text-muted-foreground">
                위치: {locationField} | 사진 {photos.length}장 | {isUrgent ? "🚨 긴급" : "일반"}
              </p>
            </div>
            <SignaturePad hasSigned={hasSigned} onSignChange={setHasSigned} timestamp={timestamp} />
          </div>
        )}

        {/* Step 5: Complete */}
        {currentStep === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              isUrgent ? "bg-destructive/10" : "bg-primary/10"
            )}>
              <Send className={cn("w-10 h-10", isUrgent ? "text-destructive" : "text-primary")} />
            </div>
            <h2 className="text-lg font-bold text-foreground">접수 완료!</h2>
            <p className="text-sm text-muted-foreground text-center">
              하자 접수가 완료되었습니다.<br />
              위치: <span className="font-bold text-foreground">{locationField}</span><br />
              상태: <span className={cn("font-bold", isUrgent ? "text-destructive" : "text-warning")}>
                {isUrgent ? "🚨 긴급" : "미배정"}
              </span><br />
              {isUrgent ? "긴급 하자로 분류되어 즉시 처리됩니다." : "관리자 확인 후 업체가 배정됩니다."}
            </p>
            <Button onClick={() => navigate("/")} className="mt-4 w-full h-12 rounded-xl">
              홈으로 돌아가기
            </Button>
          </div>
        )}
      </div>

      {/* Floating Bottom Button */}
      {currentStep < 5 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex gap-3 z-50">
          {currentStep > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} className="flex-1 h-14 rounded-xl text-base">
              이전
            </Button>
          )}
          {currentStep < 4 && (
            <Button
              disabled={!canNext()}
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 h-14 rounded-xl text-base font-bold"
            >
              다음
            </Button>
          )}
          {currentStep === 4 && (
            <Button
              disabled={!hasSigned}
              onClick={handleSubmit}
              className={cn(
                "flex-1 h-14 rounded-xl text-base font-bold",
                isUrgent && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              )}
            >
              {isUrgent ? "🚨 긴급 접수하기" : "서명 완료 → 접수하기"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DefectReportPage;
