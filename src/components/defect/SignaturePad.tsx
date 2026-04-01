import { useRef, useState } from "react";

interface SignaturePadProps {
  hasSigned: boolean;
  onSignChange: (signed: boolean) => void;
  timestamp: string;
}

const SignaturePad = ({ hasSigned, onSignChange, timestamp }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    onSignChange(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSig = () => {
    const c = canvasRef.current;
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    onSignChange(false);
  };

  return (
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
  );
};

export default SignaturePad;
