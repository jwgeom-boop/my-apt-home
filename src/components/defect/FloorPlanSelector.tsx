import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import floorplanImg from "@/assets/floorplan-extended.png";

interface FloorPlanRoom {
  id: string;
  label: string;
  points: string;
}

const EXTENDED_ROOMS: FloorPlanRoom[] = [
  { id: "거실",        label: "거실",        points: "28,48 68,48 68,84 28,84" },
  { id: "침실1(안방)", label: "침실1(안방)", points: "14,50 42,50 42,83 14,83" },
  { id: "침실2",       label: "침실2",       points: "56,37 79,37 79,62 56,62" },
  { id: "침실3",       label: "침실3",       points: "51,6 79,6 79,34 51,34" },
  { id: "욕실1",       label: "욕실1",       points: "34,21 48,21 48,39 34,39" },
  { id: "욕실2",       label: "욕실2",       points: "4,56 15,56 15,76 4,76" },
  { id: "드레스룸",    label: "드레스룸",    points: "4,34 15,34 15,55 4,55" },
  { id: "현관",        label: "현관",        points: "36,39 52,39 52,57 36,57" },
  { id: "주방/식당",   label: "주방/식당",   points: "68,48 85,48 85,79 68,79" },
  { id: "알파룸",      label: "알파룸",      points: "63,79 81,79 81,94 63,94" },
  { id: "발코니(하)",  label: "발코니(하)",  points: "15,84 43,84 43,97 15,97" },
  { id: "발코니(우)",  label: "발코니(우)",  points: "81,79 96,79 96,97 81,97" },
];

const OPTION_ROOMS: FloorPlanRoom[] = [...EXTENDED_ROOMS];

const ROOM_NAMES = ["거실", "침실1(안방)", "침실2", "침실3", "드레스룸", "욕실1", "욕실2", "현관", "주방/식당", "알파룸", "발코니(하)", "발코니(우)"];

interface FloorPlanSelectorProps {
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
}

const FloorPlanSelector = ({ selectedRoom, onSelectRoom }: FloorPlanSelectorProps) => {
  const [planType, setPlanType] = useState<"extended" | "option">("extended");
  const [debugXY, setDebugXY] = useState<{x:number, y:number} | null>(null);
  const rooms = planType === "extended" ? EXTENDED_ROOMS : OPTION_ROOMS;

  // Editor state
  const [editMode, setEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string>("거실");
  const [currentPoints, setCurrentPoints] = useState<{x: number, y: number}[]>([]);
  const [savedPoints, setSavedPoints] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCurrentPoints(prev => [...prev, { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) }]);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-bold text-foreground mb-1">🏠 방 선택</h3>
      <p className="text-[11px] text-primary mb-3">점검할 공간을 도면에서 직접 터치해 주세요</p>

      {/* Extension / Option Toggle */}
      <div className="flex mb-3 bg-muted/30 rounded-lg p-0.5 w-fit">
        <button
          onClick={() => setPlanType("extended")}
          className={cn(
            "text-xs font-bold px-4 py-1.5 rounded-md transition-all",
            planType === "extended"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          )}
        >
          확장
        </button>
        <button
          onClick={() => setPlanType("option")}
          className={cn(
            "text-xs font-bold px-4 py-1.5 rounded-md transition-all",
            planType === "option"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          )}
        >
          옵션
        </button>
      </div>

      {/* Edit mode toggle */}
      <div className="flex justify-end mb-1">
        <button
          onClick={() => { setEditMode(!editMode); setCurrentPoints([]); }}
          className={cn(
            "text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors",
            editMode
              ? "bg-destructive/10 text-destructive border-destructive/30"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {editMode ? "✕ 편집 종료" : "📐 좌표 편집"}
        </button>
      </div>

      {/* Floor plan with SVG overlay */}
      <div className="relative w-full" onClick={handleImageClick}>
        <img
          ref={imgRef}
          src={floorplanImg}
          alt="평면도"
          className="w-full rounded-lg border border-border"
          draggable={false}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: editMode ? "none" : "none" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            setDebugXY({ x: Number(x), y: Number(y) });
          }}
        >
          {rooms.map((room) => {
            const isSelected = selectedRoom === room.id;
            return (
              <polygon
                key={room.id}
                points={room.points}
                fill={isSelected ? "rgba(59, 130, 246, 0.35)" : "transparent"}
                stroke={isSelected ? "rgba(59, 130, 246, 0.8)" : "transparent"}
                strokeWidth="0.5"
                className="cursor-pointer transition-all duration-200"
                style={{ pointerEvents: editMode ? "none" : "all" }}
                onClick={() => onSelectRoom(room.id)}
              />
            );
          })}

          {/* Edit mode: polygon preview */}
          {editMode && currentPoints.length > 0 && (
            <>
              <polyline
                points={currentPoints.map(p => `${p.x},${p.y}`).join(" ")}
                fill="rgba(234,179,8,0.2)"
                stroke="rgba(234,179,8,0.9)"
                strokeWidth="0.8"
                strokeDasharray="2,1"
              />
              {currentPoints.map((p, i) => (
                <circle key={`c-${i}`} cx={p.x} cy={p.y} r="1.2" fill="rgba(234,179,8,1)" />
              ))}
              {currentPoints.map((p, i) => (
                <text key={`t-${i}`} x={p.x + 1.5} y={p.y + 1} fontSize="3" fill="white" fontWeight="bold">{i+1}</text>
              ))}
            </>
          )}
        </svg>

        {/* Selected room label overlay */}
        {selectedRoom && !editMode && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-lg shadow-md animate-fade-in">
            📍 {selectedRoom}
          </div>
        )}
        {debugXY && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono z-10">
            x: {debugXY.x}, y: {debugXY.y}
          </div>
        )}
      </div>

      {/* Editor panel */}
      {editMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-3 mt-3">
          {/* Room selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-amber-800 shrink-0">방 선택:</label>
            <select
              value={editingRoom}
              onChange={(e) => { setEditingRoom(e.target.value); setCurrentPoints([]); }}
              className="flex-1 text-xs border border-amber-300 rounded-lg px-2 py-1.5 bg-white"
            >
              {ROOM_NAMES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Point count and clear */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-700">
              {currentPoints.length > 0 ? `${currentPoints.length}개 꼭짓점 찍힘` : "도면을 클릭해서 꼭짓점을 찍으세요"}
            </span>
            <button
              onClick={() => setCurrentPoints([])}
              className="text-[11px] text-amber-600 underline"
            >
              초기화
            </button>
          </div>

          {/* Generated points string */}
          {currentPoints.length >= 3 && (
            <div className="bg-white border border-amber-300 rounded-lg p-2">
              <p className="text-[10px] text-amber-600 font-bold mb-1">{editingRoom} 좌표값:</p>
              <p className="text-[11px] font-mono text-foreground break-all leading-relaxed">
                {currentPoints.map(p => `${p.x},${p.y}`).join(" ")}
              </p>
            </div>
          )}

          {/* Save + Copy buttons */}
          {currentPoints.length >= 3 && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const pointStr = currentPoints.map(p => `${p.x},${p.y}`).join(" ");
                  setSavedPoints(prev => ({ ...prev, [editingRoom]: pointStr }));
                  navigator.clipboard.writeText(`{ id: "${editingRoom}", label: "${editingRoom}", points: "${pointStr}" }`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 bg-amber-500 text-white text-xs font-bold py-2 rounded-lg"
              >
                {copied ? "✓ 복사됨!" : "📋 코드 복사"}
              </button>
              <button
                onClick={() => setCurrentPoints([])}
                className="flex-1 bg-white border border-amber-300 text-amber-700 text-xs font-bold py-2 rounded-lg"
              >
                다음 방 편집
              </button>
            </div>
          )}

          {/* Saved rooms summary */}
          {Object.keys(savedPoints).length > 0 && (
            <div className="bg-white border border-amber-200 rounded-lg p-2">
              <p className="text-[10px] font-bold text-amber-700 mb-1">저장된 방: {Object.keys(savedPoints).join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloorPlanSelector;
