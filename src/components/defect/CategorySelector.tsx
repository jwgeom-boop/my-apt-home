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
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <div className="flex">

            {/* 왼쪽: 시설 목록 (세로 스크롤) */}
            <div className="flex flex-col border-r border-border min-w-[80px] max-h-[220px] overflow-y-auto">
              {mainCat.mids.map((mid) => (
                <button
                  key={mid.name}
                  onClick={() => onSelectMid(mid.name)}
                  className={cn(
                    "px-3 py-3 text-xs font-medium text-left whitespace-nowrap transition-all border-b border-border last:border-b-0",
                    selectedMid === mid.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/20 text-foreground hover:bg-muted/40"
                  )}
                >
                  {mid.name}
                </button>
              ))}
            </div>

            {/* 오른쪽: 상세 위치 (가로 스크롤) */}
            <div className="flex-1 p-3">
              {!midCat ? (
                <p className="text-xs text-muted-foreground mt-2">
                  왼쪽에서 시설을 선택하세요
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {midCat.subs.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => onSelectSub(sub, midCat.name)}
                      className={cn(
                        "px-3 py-1.5 rounded-full border text-xs font-medium transition-all whitespace-nowrap",
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
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
