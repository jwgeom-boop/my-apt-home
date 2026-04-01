import { cn } from "@/lib/utils";
import { MainCategory, MidCategory, SubCategory } from "@/data/defectCategories";
import { Check, ChevronDown } from "lucide-react";

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

      {/* Step 1: 공간 선택 (Main) */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          📍 공간 선택
          {selectedMain && <Check className="w-4 h-4 text-primary" />}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => {
            const isSelected = selectedMain === cat.name;
            const isDimmed = selectedMain && !isSelected;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectMain(cat.name)}
                className={cn(
                  "text-xs py-3 rounded-xl border font-medium transition-all flex flex-col items-center gap-1.5 active:scale-[0.97]",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-muted/30 text-foreground border-border hover:border-primary/40",
                  isDimmed && "opacity-40"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: 시설 선택 (Mid) - expands below */}
      {mainCat && (
        <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
            🔧 시설 선택
            {selectedMid && <Check className="w-4 h-4 text-primary" />}
          </h3>
          <p className="text-[11px] text-muted-foreground mb-3">{selectedMain} 내 점검할 시설을 선택하세요</p>
          <div className="flex flex-col gap-2">
            {mainCat.mids.map((mid) => {
              const isSelected = selectedMid === mid.name;
              const isDimmed = selectedMid && !isSelected;
              return (
                <button
                  key={mid.name}
                  onClick={() => onSelectMid(mid.name)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl border font-medium text-sm transition-all active:scale-[0.98]",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/20 text-foreground border-border hover:border-primary/30",
                    isDimmed && "opacity-40"
                  )}
                >
                  <span>{mid.name}</span>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <span>{mid.subs.length}개</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isSelected && "rotate-180")} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: 상세 위치 선택 (Sub) - expands below */}
      {midCat && (
        <div className="bg-card rounded-xl border border-border p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
            📋 상세 위치
            {selectedSub && <Check className="w-4 h-4 text-primary" />}
          </h3>
          <p className="text-[11px] text-muted-foreground mb-3">점검할 상세 위치를 선택하세요</p>
          <div className="flex flex-wrap gap-2">
            {midCat.subs.map((sub) => {
              const isSelected = selectedSub === sub.name;
              const isDimmed = selectedSub && !isSelected;
              return (
                <button
                  key={sub.name}
                  onClick={() => onSelectSub(sub, midCat.name)}
                  className={cn(
                    "text-xs px-4 py-2.5 rounded-lg border font-medium transition-all active:scale-[0.97]",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/30 text-foreground border-border hover:border-primary/40",
                    isDimmed && "opacity-40",
                    sub.isUrgent && "ring-1 ring-destructive/40"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                  {sub.name}
                  {sub.isUrgent && <span className="ml-1 text-[10px]">⚠️</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
