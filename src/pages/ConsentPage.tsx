import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConsentPage = () => {
  const navigate = useNavigate();
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
        <button onClick={() => navigate("/notice")} className="mr-2 flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs text-white/70">공지 목록</span>
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-16">동의서 서명</h1>
      </header>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-4 overflow-y-auto">
        {/* Title Card */}
        <div className="bg-card border border-amber-300 rounded-xl p-4">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-300 font-semibold">
            동의서
          </span>
          <h2 className="text-base font-bold text-foreground mt-2">층간소음 준수 확약서</h2>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3">동의서 내용</h3>
          <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
            <p>본인은 입주 후 아래 사항을 준수할 것을 확약합니다.</p>
            <p>1. 야간(22시~익일 06시)에는 소음 발생 행위를 금지한다.</p>
            <p>2. 이웃 세대에 피해를 주는 행위를 하지 않는다.</p>
            <p>3. 위반 시 관리규약에 따른 제재를 수용한다.</p>
            <div className="pt-2 border-t border-border mt-3">
              <p>본 확약서는 전자적 방식으로 서명하며</p>
              <p>동일한 법적 효력을 가집니다.</p>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-2">
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
                <span className="text-sm text-muted-foreground">서명 영역 (터치)</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground">서명일시: {timestamp}</span>
            <button onClick={clearSignature} className="text-xs text-primary">서명 지우기</button>
          </div>
        </div>

        {/* Submit */}
        <Button
          disabled={!hasSigned}
          onClick={() => {
            localStorage.setItem("consentSigned", "true");
            navigate("/");
          }}
          className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-base font-bold"
        >
          동의 및 서명 완료
        </Button>
      </div>
    </div>
  );
};

export default ConsentPage;
