import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ConsentPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

  const consentItems = [
    { title: "개인정보 수집·이용 동의", desc: "입주 절차 진행을 위해 성명, 연락처, 세대정보를 수집합니다." },
    { title: "관리규약 준수 동의", desc: "입주 후 아파트 관리규약을 준수할 것에 동의합니다." },
    { title: "사전점검 결과 확인", desc: "사전점검 시 발견된 하자에 대해 보수 일정을 확인합니다." },
    { title: "이사 일정 및 주차 배정 동의", desc: "배정된 이사 일정과 주차 구역을 확인하고 동의합니다." },
  ];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-6">동의서 서명</h1>
      </header>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-4 overflow-y-auto">
        {/* Consent Items */}
        <div className="space-y-3">
          {consentItems.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-1">
                {i + 1}. {item.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Agree All */}
        <label className="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary accent-primary"
          />
          <span className="text-sm font-semibold text-foreground">위 내용을 모두 확인하고 동의합니다</span>
        </label>

        {/* Signature */}
        <div className="bg-background border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-bold text-foreground">전자 서명</h3>
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
          <div className="flex justify-end">
            <button onClick={clearSignature} className="text-xs text-primary underline">초기화</button>
          </div>
        </div>

        {/* Submit */}
        <Button
          disabled={!hasSigned || !agreed}
          className="w-full h-14 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-base font-bold"
        >
          서명 완료
        </Button>
      </div>
    </div>
  );
};

export default ConsentPage;
