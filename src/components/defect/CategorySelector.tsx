import { cn } from "@/lib/utils";
import { MainCategory, MidCategory, SubCategory } from "@/data/defectCategories";

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
    <div className="flex flex-col gap-4">
      {/* 대분류: 공간 */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-sm font-bold text-foreground mb-3">📍 공간 선택 (대분류)</h3>
        <div className="grid grid-cols-3 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectMain(cat.name)}
              className={cn(
                "text-xs py-3 rounded-xl border font-medium transition-all flex flex-col items-center gap-1",
                selectedMain === cat.name
                  ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                  : "bg-muted/30 text-foreground border-border hover:border-primary/40"
              )}
            >
              <span className="text-lg">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 중분류: 시설 */}
      {mainCat && (
        <div className="bg-card rounded-xl border border-border p-4 animate-in slide-in-from-bottom-2 duration-200">
          <h3 className="text-sm font-bold text-foreground mb-3">🔧 시설 선택 (중분류)</h3>
          <div className="flex flex-wrap gap-2">
            {mainCat.mids.map((mid) => (
              <button
                key={mid.name}
                onClick={() => onSelectMid(mid.name)}
                className={cn(
                  "text-xs px-4 py-2.5 rounded-lg border font-medium transition-all",
                  selectedMid === mid.name
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-foreground border-border hover:border-primary/40"
                )}
              >
                {mid.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 소분류: 상세 위치 */}
      {midCat && (
        <div className="bg-card rounded-xl border border-border p-4 animate-in slide-in-from-bottom-2 duration-200">
          <h3 className="text-sm font-bold text-foreground mb-3">📋 상세 위치 (소분류)</h3>
          <div className="flex flex-wrap gap-2">
            {midCat.subs.map((sub) => (
              <button
                key={sub.name}
                onClick={() => onSelectSub(sub, midCat.name)}
                className={cn(
                  "text-xs px-4 py-2.5 rounded-lg border font-medium transition-all",
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
