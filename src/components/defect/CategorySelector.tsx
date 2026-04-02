import { cn } from "@/lib/utils";
import { MainCategory, SubCategory } from "@/data/defectCategories";
import { Check } from "lucide-react";
import FloorPlanSelector from "./FloorPlanSelector";

interface CategorySelectorProps {
  categories: MainCategory[];
  selectedMain: string;
  selectedMid: string;
  selectedSub: string;
  onSelectMain: (name: string) => void;
  onSelectMid: (name: string) => void;
  onSelectSub: (sub: SubCategory, midName: string) => void;
}

const CategorySelector = ({
  categories,
  selectedMain,
  selectedMid,
  selectedSub,
  onSelectMain,
  onSelectMid,
  onSelectSub,
}: CategorySelectorProps) => {
  const mainCat = categories.find((c) => c.name === selectedMain);
  const midCat = mainCat?.mids.find((m) => m.name === selectedMid);

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb path */}
      {selectedMain && (
        <div className="flex items-center gap-1.5 text-xs px-1 text-muted-foreground">
          <span className="font-medium text-primary">{selectedMain}</span>
          {selectedMid && (
            <>
              <span>›</span>
              <span className="font-medium text-primary">{selectedMid}</span>
            </>
          )}
          {selectedSub && (
            <>
              <span>›</span>
              <span className="font-medium text-primary">{selectedSub}</span>
            </>
          )}
        </div>
      )}

      {/* Step 1: 평면도 기반 공간 선택 */}
      <FloorPlanSelector
        selectedRoom={selectedMain}
        onSelectRoom={onSelectMain}
      />

      {/* Step 2: 시설 선택 (Mid) - 가로 스크롤 탭 */}
      {mainCat && (
        <div className="bg-card rounded-xl border border-border px-4 py-3 animate-fade-in">
          <p className="text-xs font-bold text-muted-foreground mb-2">시설 선택</p>
          <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
            {mainCat.mids.map((mid) => (
              <button
                key={mid.name}
                onClick={() => onSelectMid(mid.name)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap",
                  selectedMid === mid.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-foreground border-border"
                )}
              >
                {mid.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: 상세 위치 선택 (Sub) - 가로 스크롤 칩 */}
      {midCat && (
        <div className="bg-card rounded-xl border border-border px-4 py-3 animate-fade-in">
          <p className="text-xs font-bold text-muted-foreground mb-2">상세 위치</p>
          <div className="overflow-x-auto flex gap-2 pb-1 scrollbar-hide">
            {midCat.subs.map((sub) => (
              <button
                key={sub.name}
                onClick={() => onSelectSub(sub, midCat.name)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap",
                  selectedSub === sub.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-foreground border-border",
                  sub.isUrgent && "ring-1 ring-destructive/40"
                )}
              >
                {sub.name}{sub.isUrgent ? " ⚠️" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
