import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Phone, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import BottomTabBar from "@/components/BottomTabBar";
import OfflineScreen from "@/components/OfflineScreen";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import SatisfactionRating from "@/components/defect/SatisfactionRating";

interface DefectDetail {
  id: string;
  receiptNo: string;
  location: string;
  guideItems: string[];
  isUrgent: boolean;
  photoCount: number;
  photoData: { guide: string; memo: string; timestamp: string; gps: string; dataUrl?: string }[];
  status: string;
  createdAt: string;
  assignedCompany: string | null;
  notes: string | null;
}

const STEPS = [
  { label: "접수완료", key: "receipt" },
  { label: "담당자 배정", key: "assign" },
  { label: "처리중", key: "work" },
  { label: "처리완료", key: "complete" },
] as const;

function getCompletedSteps(status: string): number {
  if (status === "미배정") return 1;
  if (status === "접수완료" || status === "배정완료") return 2;
  if (status === "처리중") return 3;
  if (status === "처리완료" || status === "완료") return 4;
  return 1;
}

const DefectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defect, setDefect] = useState<DefectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    const loadDefect = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("defects")
        .select("*")
        .eq("receipt_no", id)
        .single();

      if (data) {
        const photoData = Array.isArray(data.photo_data)
          ? (data.photo_data as { guide: string; memo: string; timestamp: string; gps: string; dataUrl?: string }[])
          : [];
        setDefect({
          id: data.id,
          receiptNo: data.receipt_no,
          location: data.location,
          guideItems: data.guide_items,
          isUrgent: data.is_urgent,
          photoCount: data.photo_count,
          photoData,
          status: data.status,
          createdAt: new Date(data.created_at).toLocaleString("ko-KR"),
          assignedCompany: data.assigned_company,
          notes: data.notes,
        });
      }
      setLoading(false);
    };
    loadDefect();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">로딩 중...</p>
      </div>
    );
  }

  if (!defect) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-background">
        <NetworkStatusBanner />
        {!navigator.onLine ? (
          <OfflineScreen />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-muted-foreground text-sm">해당 하자 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    );
  }

  const completedSteps = getCompletedSteps(defect.status);
  const isComplete = defect.status === "처리완료" || defect.status === "완료";
  const isAssigned = defect.status !== "미배정";

  const photoUrls = defect.photoData
    .filter((p) => p.dataUrl)
    .map((p) => p.dataUrl!);

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold flex-1">하자 처리 현황</h1>
        {defect.isUrgent && (
          <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
            🚨 긴급
          </span>
        )}
      </header>

      <main className="pb-20">
        {/* Section 1 — 접수 정보 */}
        <div className="bg-card rounded-xl p-4 border border-border mt-4 mx-4">
          <h3 className="text-sm font-bold text-foreground mb-3">접수 정보</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">접수번호</span>
              <span className="font-semibold text-foreground">{defect.receiptNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">위치</span>
              <span className="font-semibold text-foreground">{defect.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">하자 내용</span>
              <span className="font-semibold text-foreground">{defect.guideItems.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">사진</span>
              <span className="font-semibold text-foreground">{defect.photoCount}장</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">접수일시</span>
              <span className="font-semibold text-foreground">{defect.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Section 2 — 처리 타임라인 */}
        <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
          <h3 className="text-sm font-bold text-foreground mb-4">처리 현황</h3>
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isStepCompleted = stepNum < completedSteps;
              const isCurrent = stepNum === completedSteps && !isComplete;
              const isAllDone = isComplete && stepNum <= completedSteps;
              const done = isStepCompleted || isAllDone;

              return (
                <div key={step.label}>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        done && "bg-green-500 text-white",
                        isCurrent && "bg-primary/20 border-2 border-primary",
                        !done && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? (
                        <Check className="w-4 h-4" />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <span className="text-xs font-bold">{stepNum}</span>
                      )}
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", done || isCurrent ? "text-foreground" : "text-muted-foreground")}>
                        {step.label}
                      </p>
                      {done && (
                        <p className="text-xs text-muted-foreground">{defect.createdAt}</p>
                      )}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="ml-[15px] w-0.5 h-6 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3 — 사진 섹션 */}
        {photoUrls.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
            <h3 className="text-sm font-bold text-foreground mb-3">접수 사진</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photoUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => { setViewerIndex(idx); setViewerOpen(true); }}
                  className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-border"
                >
                  <img src={url} alt={`사진 ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 4 — 담당자 정보 */}
        <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
          <h3 className="text-sm font-bold text-foreground mb-3">담당자 정보</h3>
          {!isAssigned ? (
            <p className="text-xs text-muted-foreground">담당자 배정 대기중</p>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">담당 업체</span>
                <span className="font-semibold text-foreground">{defect.assignedCompany || "-"}</span>
              </div>
              {defect.notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">처리 메모</span>
                  <span className="font-semibold text-foreground">{defect.notes}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 5 — 완료 확인 버튼 */}
        {isComplete && (
          <div className="mx-4 mt-3">
            <button
              onClick={() => toast.success("확인 완료되었습니다")}
              className="w-full h-12 rounded-xl bg-green-500 text-white font-bold text-sm active:scale-[0.98] transition-transform"
            >
              처리 결과 확인 완료
            </button>
          </div>
        )}
      </main>

      {/* Full-screen image viewer */}
      {viewerOpen && photoUrls.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="relative w-full h-full flex items-center justify-center px-12">
            {viewerIndex > 0 && (
              <button
                onClick={() => setViewerIndex((i) => i - 1)}
                className="absolute left-2 text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            <img
              src={photoUrls[viewerIndex]}
              alt={`사진 ${viewerIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {viewerIndex < photoUrls.length - 1 && (
              <button
                onClick={() => setViewerIndex((i) => i + 1)}
                className="absolute right-2 text-white/70 hover:text-white"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
          <p className="text-white/60 text-sm mt-4">{viewerIndex + 1} / {photoUrls.length}</p>
        </div>
      )}

      <BottomTabBar />
    </div>
  );
};

export default DefectDetailPage;
