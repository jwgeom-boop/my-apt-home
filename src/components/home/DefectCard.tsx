import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ClipboardList, ListChecks, ChevronRight, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DefectRow {
  receipt_no: string;
  location: string;
  mid_category: string | null;
  status: string;
  is_urgent: boolean;
}

const statusColorMap: Record<string, string> = {
  "미배정": "text-muted-foreground",
  "접수완료": "text-primary",
  "배정완료": "text-primary",
  "처리중": "text-warning",
  "처리완료": "text-success",
  "완료": "text-success",
};

interface DefectCardProps {
  defects: DefectRow[];
  loadingDefects: boolean;
}

const DefectCard = ({ defects, loadingDefects }: DefectCardProps) => {
  const navigate = useNavigate();
  const [showDefectList, setShowDefectList] = useState(false);

  const statusCounts = {
    접수완료: defects.filter((d) => ["미배정", "접수완료", "배정완료"].includes(d.status)).length,
    처리중: defects.filter((d) => d.status === "처리중").length,
    완료: defects.filter((d) => ["처리완료", "완료"].includes(d.status)).length,
  };

  return (
    <>
      <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">하자 현황</h3>
          </div>
          <button
            onClick={() => navigate("/defect")}
            className="flex items-center gap-1 bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <ClipboardList className="w-3 h-3" />
            접수하기
          </button>
        </div>

        {loadingDefects ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{statusCounts.접수완료}</p>
              <p className="text-[11px] text-muted-foreground mt-1">접수완료</p>
            </div>
            <div className="bg-warning/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-warning">{statusCounts.처리중}</p>
              <p className="text-[11px] text-muted-foreground mt-1">처리중</p>
            </div>
            <div className="bg-success/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-success">{statusCounts.완료}</p>
              <p className="text-[11px] text-muted-foreground mt-1">완료</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowDefectList(true)}
          className="w-full flex items-center justify-center gap-1 mt-3 pt-3 border-t border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ListChecks className="w-3.5 h-3.5" />
          나의 접수 내역 보기
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {showDefectList && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDefectList(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[75vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">나의 하자 접수 내역</h3>
              <button onClick={() => setShowDefectList(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loadingDefects ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : defects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">접수된 하자가 없습니다</p>
              ) : (
                <div className="space-y-3">
                  {defects.map((d) => (
                    <div key={d.receipt_no} className="flex items-center justify-between bg-muted/30 rounded-xl px-4 py-3 border border-border">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{d.receipt_no}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.mid_category || ""} · {d.location}</p>
                      </div>
                      <span className={cn("text-sm font-bold shrink-0", statusColorMap[d.status] || "text-muted-foreground")}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-border">
              <button
                onClick={() => { setShowDefectList(false); navigate("/defect"); }}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-bold active:scale-[0.98] transition-transform"
              >
                새 하자 접수하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DefectCard;
