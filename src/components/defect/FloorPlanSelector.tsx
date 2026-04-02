import { cn } from "@/lib/utils";
import { useState } from "react";
import floorplanImg from "@/assets/floorplan-extended.png";

interface FloorPlanRoom {
  id: string;
  label: string;
  points: string;
}

const EXTENDED_ROOMS: FloorPlanRoom[] = [
  { id: "거실",        label: "거실",        points: "28,48 70,48 70,84 28,84" },
  { id: "침실1(안방)", label: "침실1(안방)", points: "14,50 42,50 42,83 14,83" },
  { id: "침실2",       label: "침실2",       points: "56,37 79,37 79,62 56,62" },
  { id: "침실3",       label: "침실3",       points: "51,6 79,6 79,34 51,34" },
  { id: "욕실1",       label: "욕실1",       points: "34,21 48,21 48,39 34,39" },
  { id: "욕실2",       label: "욕실2",       points: "4,56 15,56 15,76 4,76" },
  { id: "드레스룸",    label: "드레스룸",    points: "4,34 15,34 15,55 4,55" },
  { id: "현관",        label: "현관",        points: "34,39 51,39 51,56 34,56" },
  { id: "주방/식당",   label: "주방/식당",   points: "66,49 85,49 85,79 66,79" },
  { id: "알파룸",      label: "알파룸",      points: "63,79 81,79 81,94 63,94" },
  { id: "발코니(하)",  label: "발코니(하)",  points: "15,85 43,85 43,97 15,97" },
  { id: "발코니(우)",  label: "발코니(우)",  points: "83,79 96,79 96,97 83,97" },
];

const OPTION_ROOMS: FloorPlanRoom[] = [...EXTENDED_ROOMS];

interface FloorPlanSelectorProps {
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
}

const FloorPlanSelector = ({ selectedRoom, onSelectRoom }: FloorPlanSelectorProps) => {
  const [planType, setPlanType] = useState<"extended" | "option">("extended");
  const [debugXY, setDebugXY] = useState<{x:number, y:number} | null>(null);
  const rooms = planType === "extended" ? EXTENDED_ROOMS : OPTION_ROOMS;

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

      {/* Floor plan with SVG overlay */}
      <div className="relative w-full">
        <img
          src={floorplanImg}
          alt="평면도"
          className="w-full rounded-lg border border-border"
          draggable={false}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: "none" }}
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
                style={{ pointerEvents: "all" }}
                onClick={() => onSelectRoom(room.id)}
              />
            );
          })}
        </svg>

        {/* Selected room label overlay */}
        {selectedRoom && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-lg shadow-md animate-fade-in">
            📍 {selectedRoom}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlanSelector;
