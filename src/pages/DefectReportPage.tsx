import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = ["사진", "유형", "내용", "서명", "완료"];

const DefectReportPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(3); // 서명 단계 (0-indexed)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const now = new Date();
  const timestamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} KST`;

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
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
    ctx.strokeStyle = "#1A3C5E";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs text-white/70">← 하자 목록</span>
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
                  i <= currentStep
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
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

        {/* Summary Card */}
        <div className="bg-sky/30 rounded-xl p-4 border border-sky/50">
          <h3 className="text-sm font-bold text-foreground mb-1">접수 내용 요약</h3>
          <p className="text-xs text-muted-foreground">
            유형: 도배·도장 | 위치: 안방 벽면 | 사진 3장 첨부
          </p>
        </div>

        {/* Signature Area */}
        <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3">
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
            <button onClick={clearSignature} className="text-xs text-primary underline">초기화</button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          disabled={!hasSigned}
          className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-bold"
        >
          서명 완료 → 접수하기
        </Button>

        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          <span className="text-green-600 text-sm">✔</span>
          <span className="text-xs text-green-700">접수 완료 시 관리자에게 즉시 전송 및 타임스탬프 기록</span>
        </div>
      </div>
    </div>
  );
};

export default DefectReportPage;
