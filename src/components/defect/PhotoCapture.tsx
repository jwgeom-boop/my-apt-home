import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhotoItem {
  id: string;
  dataUrl: string;
  memo: string;
  timestamp: string;
  gps: string;
}

interface PhotoCaptureProps {
  photos: PhotoItem[];
  maxPhotos: number;
  onCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (id: string) => void;
  onUpdateMemo: (id: string, memo: string) => void;
  disabled?: boolean;
}

const PhotoCapture = ({
  photos,
  maxPhotos,
  onCapture,
  onRemove,
  onUpdateMemo,
  disabled = false,
}: PhotoCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={onCapture}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || photos.length >= maxPhotos}
        className={cn(
          "w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-all",
          disabled
            ? "border-muted bg-muted/10 opacity-50 cursor-not-allowed"
            : "border-primary/40 bg-primary/5 hover:bg-primary/10"
        )}
      >
        <Camera className={cn("w-12 h-12", disabled ? "text-muted-foreground" : "text-primary")} />
        <span className={cn("text-sm font-bold", disabled ? "text-muted-foreground" : "text-primary")}>
          📷 사진 찍기
        </span>
        <span className="text-[11px] text-muted-foreground">
          {disabled ? "점검 가이드를 먼저 확인해주세요" : `${photos.length}/${maxPhotos}장 (최대 ${maxPhotos}장)`}
        </span>
      </button>

      {photos.length > 0 && (
        <div className="space-y-3">
          {photos.map((p) => (
            <div key={p.id} className="bg-card rounded-xl border border-border p-3 shadow-sm">
              <div className="relative">
                <img src={p.dataUrl} alt="defect" className="w-full rounded-lg object-cover max-h-48" />
                <button
                  onClick={() => onRemove(p.id)}
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
                onChange={(e) => onUpdateMemo(p.id, e.target.value)}
                className="mt-2 w-full text-xs bg-muted/30 border border-border rounded-lg px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;
