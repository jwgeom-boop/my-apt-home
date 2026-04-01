import { useState } from "react";
import { cn } from "@/lib/utils";
import { MainCategory, MidCategory, SubCategory } from "@/data/defectCategories";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CategorySelectorProps {
  categories: MainCategory[];
  selectedMain: string;
  selectedMid: string;
  selectedSub: string;
  onSelectMain: (name: string) => void;
  onSelectMid: (name: string) => void;
  onSelectSub: (sub: SubCategory, midName: string) => void;
}

type SlidePhase = "main" | "mid" | "sub";

const CategorySelector = ({
  categories,
  selectedMain,
  selectedMid,
  selectedSub,
  onSelectMain,
  onSelectMid,
  onSelectSub,
}: CategorySelectorProps) => {
  const [phase, setPhase] = useState<SlidePhase>(
    selectedSub ? "sub" : selectedMid ? "sub" : selectedMain ? "mid" : "main"
  );
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");

  const mainCat = categories.find((c) => c.name === selectedMain);
  const midCat = mainCat?.mids.find((m) => m.name === selectedMid);

  const goToMid = (name: string) => {
    onSelectMain(name);
    setSlideDir("left");
    setTimeout(() => setPhase("mid"), 50);
  };

  const goToSub = (name: string) => {
    onSelectMid(name);
    setSlideDir("left");
    setTimeout(() => setPhase("sub"), 50);
  };

  const goBack = () => {
    setSlideDir("right");
    if (phase === "sub") setTimeout(() => setPhase("mid"), 50);
    else if (phase === "mid") setTimeout(() => setPhase("main"), 50);
  };

  // breadcrumb
  const crumbs: string[] = [];
  if (selectedMain) crumbs.push(selectedMain);
  if (selectedMid && phase !== "main") crumbs.push(selectedMid);
  if (selectedSub && phase === "sub") crumbs.push(selectedSub);

  const slideClass = slideDir === "left"
    ? "animate-in slide-in-from-right-8 duration-250"
    : "animate-in slide-in-from-left-8 duration-250";

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb */}
      {crumbs.length > 0 && (
        <div className="flex items-center gap-1 text-xs px-1">
          {phase !== "main" && (
            <button onClick={goBack} className="text-primary mr-1 active:scale-95">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {crumbs.map((c, i) => (
            <span key={c} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              <span className={cn(
                "font-medium",
                i === crumbs.length - 1 ? "text-primary" : "text-muted-foreground"
              )}>{c}</span>
            </span>
          ))}
        </div>
      )}

      {/* Phase: Main (공간) */}
      {phase === "main" && (
        <div className={cn("bg-card rounded-xl border border-border p-4", slideClass)}>
          <h3 className="text-sm font-bold text-foreground mb-3">📍 공간 선택</h3>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => goToMid(cat.name)}
                className={cn(
                  "text-xs py-3 rounded-xl border font-medium transition-all flex flex-col items-center gap-1.5 active:scale-[0.97]",
                  selectedMain === cat.name
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-muted/30 text-foreground border-border hover:border-primary/40"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Mid (시설) */}
      {phase === "mid" && mainCat && (
        <div className={cn("bg-card rounded-xl border border-border p-4", slideClass)}>
          <h3 className="text-sm font-bold text-foreground mb-1">🔧 시설 선택</h3>
          <p className="text-[11px] text-muted-foreground mb-3">{selectedMain} 내 점검할 시설을 선택하세요</p>
          <div className="flex flex-col gap-2">
            {mainCat.mids.map((mid) => (
              <button
                key={mid.name}
                onClick={() => goToSub(mid.name)}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl border font-medium text-sm transition-all active:scale-[0.98]",
                  selectedMid === mid.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/20 text-foreground border-border hover:border-primary/30"
                )}
              >
                <span>{mid.name}</span>
                <div className="flex items-center gap-1 text-xs opacity-70">
                  <span>{mid.subs.length}개</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phase: Sub (상세 위치) */}
      {phase === "sub" && midCat && (
        <div className={cn("bg-card rounded-xl border border-border p-4", slideClass)}>
          <h3 className="text-sm font-bold text-foreground mb-1">📋 상세 위치</h3>
          <p className="text-[11px] text-muted-foreground mb-3">점검할 상세 위치를 선택하세요</p>
          <div className="flex flex-wrap gap-2">
            {midCat.subs.map((sub) => (
              <button
                key={sub.name}
                onClick={() => onSelectSub(sub, midCat.name)}
                className={cn(
                  "text-xs px-4 py-2.5 rounded-lg border font-medium transition-all active:scale-[0.97]",
                  selectedSub === sub.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-foreground border-border hover:border-primary/40",
                  sub.isUrgent && "ring-1 ring-destructive/40"
                )}
              >
                {sub.name}
                {sub.isUrgent && <span className="ml-1 text-[10px]">⚠️</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
