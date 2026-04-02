import { cn } from "@/lib/utils";
import { useState } from "react";
import floorplanImg from "@/assets/floorplan-extended.png";

interface FloorPlanRoom {
  id: string;
  label: string;
  points: string;
}

const EXTENDED_ROOMS: FloorPlanRoom[] = [
  { id: "드레스룸",    label: "드레스룸",    points: "0,32 14,32 14,58 0,58" },
  { id: "욕실2",       label: "욕실2",       points: "0,58 14,58 14,82 0,82" },
  { id: "침실1(안방)", label: "침실1(안방)", points: "14,45 50,45 50,90 14,90" },
  { id: "발코니(하)",  label: "발코니(하)",  points: "14,90 65,90 65,100 14,100" },
  { id: "욕실1",       label: "욕실1",       points: "30,22 50,22 50,45 30,45" },
  { id: "현관",        label: "현관",        points: "30,45 52,45 52,65 30,65" },
  { id: "거실",        label: "거실",        points: "50,45 68,45 68,90 50,90" },
  { id: "침실3",       label: "침실3",       points: "52,0 100,0 100,42 52,42" },
  { id: "침실2",       label: "침실2",       points: "52,42 88,42 88,68 52,68" },
  { id: "주방/식당",   label: "주방/식당",   points: "68,42 100,42 100,75 68,75" },
  { id: "알파룸",      label: "알파룸",      points: "68,75 88,75 88,92 68,92" },
  { id: "발코니(우)",  label: "발코니(우)",  points: "88,58 100,58 100,92 88,92" },
];

const OPTION_ROOMS: FloorPlanRoom[] = [...EXTENDED_ROOMS];

interface FloorPlanSelectorProps {
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
}

const FloorPlanSelector = ({ selectedRoom, onSelectRoom }: FloorPlanSelectorProps) => {
  const [planType, setPlanType] = useState<"extended" | "option">("extended");
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
