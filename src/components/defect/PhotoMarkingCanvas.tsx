import { useRef, useState, useEffect, useCallback } from "react";
import { X, Check, Undo2, Palette } from "lucide-react";

interface PhotoMarkingCanvasProps {
  imageDataUrl: string;
  onSave: (markedDataUrl: string) => void;
  onCancel: () => void;
}

const COLORS = ["#FF3B30", "#FF9500", "#34C759", "#007AFF", "#FFCC00"];

const PhotoMarkingCanvas = ({ imageDataUrl, onSave, onCancel }: PhotoMarkingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [history, setHistory] = useState<ImageData[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const maxW = 360;
      const scale = img.width > maxW ? maxW / img.width : 1;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
    img.src = imageDataUrl;
  }, [imageDataUrl]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!drawing) return;
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const newHist = history.slice(0, -1);
    ctx.putImageData(newHist[newHist.length - 1], 0, 0);
    setHistory(newHist);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center">
      <div className="w-full max-w-[390px] flex flex-col items-center gap-3 px-4">
        <p className="text-white text-sm font-bold">✏️ 하자 부위를 표시해주세요</p>
        <canvas
          ref={canvasRef}
          className="rounded-xl border-2 border-white/20 touch-none max-w-full"
          style={{ maxHeight: "55vh", objectFit: "contain" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Color picker */}
        <div className="flex items-center gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "#fff" : "transparent",
                transform: color === c ? "scale(1.2)" : "scale(1)",
              }}
            />
          ))}
        </div>
        {/* Actions */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white rounded-xl py-3 text-sm font-bold active:scale-[0.97]"
          >
            <X className="w-4 h-4" /> 취소
          </button>
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="flex items-center justify-center gap-1 bg-white/10 text-white rounded-xl px-4 py-3 text-sm font-bold active:scale-[0.97] disabled:opacity-30"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold active:scale-[0.97]"
          >
            <Check className="w-4 h-4" /> 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoMarkingCanvas;
