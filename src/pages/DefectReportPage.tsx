import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Camera, X, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MAX_PHOTOS = 5;
const steps = ["사진", "유형", "내용", "서명", "완료"];

interface PhotoItem {
  id: string;
  dataUrl: string;
  memo: string;
  timestamp: string;
  gps: string;
}

const DefectReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [defectType, setDefectType] = useState("");
  const [defectLocation, setDefectLocation] = useState("");
  const [defectDesc, setDefectDesc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Watermark a photo with GPS + timestamp
  const addWatermark = useCallback((file: File): Promise<PhotoItem> => {
    return new Promise((resolve) => {
      const now = new Date();
      const ts = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      // Simulate GPS coordinates (real app would use navigator.geolocation)
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

        // Watermark bar
        const barH = 44;
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, canvas.height - barH, canvas.width, barH);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px 'Noto Sans KR', sans-serif";
        ctx.fillText(`📅 ${ts}`, 12, canvas.height - 24);
        ctx.fillText(`📍 ${gpsText}`, 12, canvas.height - 8);

        resolve({
          id: crypto.randomUUID(),
          dataUrl: canvas.toDataURL("image/jpeg", 0.85),
          memo: "",
          timestamp: ts,
          gps: gpsText,
        });
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = MAX_PHOTOS - photos.length;
    const toProcess = Array.from(files).slice(0, remaining);

    const newPhotos = await Promise.all(toProcess.map((f) => addWatermark(f)));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const updateMemo = (id: string, memo: string) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, memo } : p)));

  // Signature canvas helpers
  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };
  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "hsl(209 55% 23%)";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };
  const endDraw = () => setIsDrawing(false);
  const clearSig = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    setHasSigned(false);
  };

  const canNext = () => {
    if (currentStep === 0) return photos.length > 0;
    if (currentStep === 1) return defectType !== "" && defectLocation !== "";
    if (currentStep === 2) return defectDesc.trim().length > 0;
    if (currentStep === 3) return hasSigned;
    return false;
  };

  const handleSubmit = () => {
    // Simulate submission with status "미배정"
    toast({
      title: "하자 접수 완료",
      description: `접수번호 HD-${Date.now().toString().slice(-6)} | 상태: 미배정`,
    });
    setCurrentStep(4);
  };

  const defectTypes = ["도배·도장", "설비·배관", "창호·유리", "전기·통신", "타일·바닥", "기타"];
  const locations = ["안방", "거실", "주방", "욕실", "베란다", "현관", "기타"];

  const now = new Date();
  const timestamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} KST`;

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => (currentStep > 0 && currentStep < 4 ? setCurrentStep((s) => s - 1) : navigate(-1))} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-8">하자 접수</h1>
      </header>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-4">
        {/* Step Bar */}
        <div className="flex items-center justify-between px-2">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              <span className={cn("text-[10px]", i <= currentStep ? "text-primary font-semibold" : "text-muted-foreground")}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Step 0: Photos */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={handleCapture}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= MAX_PHOTOS}
              className="w-full h-28 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40"
            >
              <Camera className="w-10 h-10 text-primary" />
              <span className="text-sm font-bold text-primary">📷 사진 찍기</span>
              <span className="text-[11px] text-muted-foreground">{photos.length}/{MAX_PHOTOS}장 (최대 5장)</span>
            </button>

            {photos.length > 0 && (
              <div className="space-y-3">
                {photos.map((p) => (
                  <div key={p.id} className="bg-card rounded-xl border border-border p-3 shadow-sm">
                    <div className="relative">
                      <img src={p.dataUrl} alt="defect" className="w-full rounded-lg object-cover max-h-48" />
                      <button
                        onClick={() => removePhoto(p.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive/80 text-white flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 rounded-b-lg">
                        📅 {p.timestamp} · 📍 {p.gps}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="메모 입력 (예: 균열 발견)"
                      value={p.memo}
                      onChange={(e) => updateMemo(p.id, e.target.value)}
                      className="mt-2 w-full text-xs bg-muted/30 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Type & Location */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">하자 유형</h3>
              <div className="grid grid-cols-3 gap-2">
                {defectTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDefectType(t)}
                    className={cn(
                      "text-xs py-2.5 rounded-lg border font-medium transition-colors",
                      defectType === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-foreground border-border"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">하자 위치</h3>
              <div className="grid grid-cols-4 gap-2">
                {locations.map((l) => (
                  <button
                    key={l}
                    onClick={() => setDefectLocation(l)}
                    className={cn(
                      "text-xs py-2.5 rounded-lg border font-medium transition-colors",
                      defectLocation === l ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-foreground border-border"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {currentStep === 2 && (
          <div className="bg-card rounded-xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">하자 상세 내용</h3>
            <textarea
              value={defectDesc}
              onChange={(e) => setDefectDesc(e.target.value)}
              placeholder="하자 상태를 자세히 설명해 주세요..."
              rows={6}
              className="w-full text-sm bg-muted/20 border border-border rounded-lg px-3 py-2.5 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
            {/* Summary */}
            <div className="mt-3 bg-muted/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">사진 {photos.length}장 · {defectType} · {defectLocation}</p>
            </div>
          </div>
        )}

        {/* Step 3: Signature */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <h3 className="text-sm font-bold text-foreground mb-1">접수 내용 요약</h3>
              <p className="text-xs text-muted-foreground">
                유형: {defectType} | 위치: {defectLocation} | 사진 {photos.length}장 첨부
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">전자 서명</h3>
                <p className="text-xs text-muted-foreground mt-1">아래 박스에 서명 후 접수를 완료해 주세요</p>
              </div>
              <div className="relative border border-border rounded-lg bg-muted/20 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={310}
                  height={140}
                  className="w-full touch-none"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-sm text-muted-foreground">여기에 서명하세요</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">접수시각: {timestamp}</span>
                <button onClick={clearSig} className="text-xs text-primary underline">초기화</button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {currentStep === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
              <Send className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-lg font-bold text-foreground">접수 완료!</h2>
            <p className="text-sm text-muted-foreground text-center">
              하자 접수가 완료되었습니다.<br />
              상태: <span className="font-bold text-warning">미배정</span><br />
              관리자 확인 후 업체가 배정됩니다.
            </p>
            <Button onClick={() => navigate("/")} className="mt-4 w-full h-12 rounded-xl">
              홈으로 돌아가기
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="mt-auto flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={() => setCurrentStep((s) => s - 1)} className="flex-1 h-14 rounded-xl text-base">
                이전
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                disabled={!canNext()}
                onClick={() => setCurrentStep((s) => s + 1)}
                className="flex-1 h-14 rounded-xl text-base font-bold"
              >
                다음
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                disabled={!hasSigned}
                onClick={handleSubmit}
                className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold"
              >
                서명 완료 → 접수하기
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DefectReportPage;
