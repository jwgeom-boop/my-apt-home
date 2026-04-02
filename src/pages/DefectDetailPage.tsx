import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import BottomTabBar from "@/components/BottomTabBar";

interface MockDefect {
  id: string;
  location: string;
  guide: string;
  isUrgent: boolean;
  photoCount: number;
  status: string;
  receiptDate: string;
  assignDate: string;
  workDate: string;
  completeDate: string;
  workerName: string;
  workerPhone: string;
  note: string;
}

const mockDefects: MockDefect[] = [
  {
    id: "HD-001",
    location: "침실1(안방) - 도배",
    guide: "벽지 들뜸, 곰팡이 흔적",
    isUrgent: false,
    photoCount: 4,
    status: "처리중",
    receiptDate: "2026.04.02 11:23",
    assignDate: "2026.04.03 09:00",
    workDate: "2026.04.04 14:00",
    completeDate: "",
    workerName: "김기술",
    workerPhone: "010-1234-5678",
    note: "도배 재시공 예정",
  },
  {
    id: "HD-002",
    location: "욕실1 - 타일",
    guide: "줄눈 균열",
    isUrgent: true,
    photoCount: 2,
    status: "완료",
    receiptDate: "2026.04.01 10:05",
    assignDate: "2026.04.01 14:00",
    workDate: "2026.04.02 10:00",
    completeDate: "2026.04.02 12:30",
    workerName: "이수리",
    workerPhone: "010-9876-5432",
    note: "줄눈 보수 완료",
  },
];

const STEPS = [
  { label: "접수완료", key: "receiptDate" },
  { label: "담당자 배정", key: "assignDate" },
  { label: "처리중", key: "workDate" },
  { label: "처리완료", key: "completeDate" },
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
  const defect = mockDefects.find((d) => d.id === id);

  if (!defect) {
    return (
      <div className="mx-auto max-w-[390px] min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">해당 하자 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const completedSteps = getCompletedSteps(defect.status);
  const isComplete = defect.status === "처리완료" || defect.status === "완료";
  const isAssigned = defect.status !== "미배정";

  const stepDates: Record<string, string> = {
    receiptDate: defect.receiptDate,
    assignDate: defect.assignDate,
    workDate: defect.workDate,
    completeDate: defect.completeDate,
  };

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
              <span className="font-semibold text-foreground">{defect.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">위치</span>
              <span className="font-semibold text-foreground">{defect.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">하자 내용</span>
              <span className="font-semibold text-foreground">{defect.guide}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">사진</span>
              <span className="font-semibold text-foreground">{defect.photoCount}장</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">접수일시</span>
              <span className="font-semibold text-foreground">{defect.receiptDate}</span>
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
              const dateStr = stepDates[step.key];

              return (
                <div key={step.label}>
                  <div className="flex items-center gap-3">
                    {/* Circle */}
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        done && "bg-primary text-primary-foreground",
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
                    {/* Label + date */}
                    <div>
                      <p className={cn("text-sm font-semibold", done || isCurrent ? "text-foreground" : "text-muted-foreground")}>
                        {step.label}
                      </p>
                      {dateStr && (
                        <p className="text-xs text-muted-foreground">{dateStr}</p>
                      )}
                    </div>
                  </div>
                  {/* Connecting line */}
                  {i < STEPS.length - 1 && (
                    <div className="ml-[15px] w-0.5 h-6 bg-border" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3 — 담당자 정보 */}
        {isAssigned && (
          <div className="bg-card rounded-xl p-4 border border-border mt-3 mx-4">
            <h3 className="text-sm font-bold text-foreground mb-3">담당자 정보</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">담당 기사</span>
                <span className="font-semibold text-foreground">{defect.workerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">연락처</span>
                <a href={`tel:${defect.workerPhone}`} className="flex items-center gap-1 text-primary font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  {defect.workerPhone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">처리 메모</span>
                <span className="font-semibold text-foreground">{defect.note}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section 4 — 완료 확인 버튼 */}
        {isComplete && (
          <div className="mx-4 mt-3">
            <button
              onClick={() => toast.success("확인 완료되었습니다")}
              className="w-full h-12 rounded-xl bg-success text-white font-bold text-sm active:scale-[0.98] transition-transform"
            >
              처리 결과 확인 완료
            </button>
          </div>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
};

export default DefectDetailPage;
