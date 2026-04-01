import { useState } from "react";
import { cn } from "@/lib/utils";
import floorplanImg from "@/assets/floorplan-extended.png";

interface FloorPlanRoom {
  id: string;
  label: string;
  // SVG polygon points as percentage of image dimensions
  points: string;
}

const EXTENDED_ROOMS: FloorPlanRoom[] = [
  { id: "거실", label: "거실", points: "5,52 5,95 42,95 42,52" },
  { id: "주방", label: "주방", points: "42,52 42,95 62,95 62,52" },
  { id: "안방", label: "안방", points: "5,5 5,50 25,50 25,5" },
  { id: "욕실", label: "욕실", points: "25,5 25,35 48,35 48,5" },
  { id: "현관", label: "현관", points: "48,5 48,35 62,35 62,20" },
  { id: "베란다", label: "베란다", points: "62,5 62,95 95,95 95,5" },
];

const OPTION_ROOMS: FloorPlanRoom[] = [
  { id: "거실", label: "거실", points: "5,52 5,95 42,95 42,52" },
  { id: "주방", label: "주방", points: "42,52 42,95 62,95 62,52" },
  { id: "안방", label: "안방", points: "5,5 5,50 25,50 25,5" },
  { id: "욕실", label: "욕실", points: "25,5 25,35 48,35 48,5" },
  { id: "현관", label: "현관", points: "48,5 48,35 62,35 62,20" },
  { id: "베란다", label: "베란다", points: "62,5 62,95 95,95 95,5" },
];

interface FloorPlanSelectorProps {
  selectedRoom: string;
  onSelectRoom: (roomId: string) => void;
  categories: { name: string; icon: string }[];
}

const FloorPlanSelector = ({ selectedRoom, onSelectRoom, categories }: FloorPlanSelectorProps) => {
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
      <div className="relative w-full mb-3">
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

      {/* Text buttons synced with image */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => {
          const isSelected = selectedRoom === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectRoom(cat.name)}
              className={cn(
                "text-xs py-2.5 rounded-xl border font-medium transition-all flex flex-col items-center gap-1 active:scale-[0.97]",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-muted/30 text-foreground border-border hover:border-primary/40",
                selectedRoom && !isSelected && "opacity-40"
              )}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorPlanSelector;
