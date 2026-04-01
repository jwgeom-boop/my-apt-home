import { CheckCircle2, Circle, QrCode, CreditCard, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const myDefects = [
  { id: "HD-2025-0012", type: "도배·도장", location: "안방 벽면", status: "처리중", statusColor: "text-warning" },
  { id: "HD-2025-0009", type: "설비·배관", location: "주방 싱크대", status: "처리완료", statusColor: "text-success" },
  { id: "HD-2025-0015", type: "창호·유리", location: "거실 창문", status: "접수완료", statusColor: "text-primary" },
];

const checklistItems = [
  { id: 1, label: "잔금 납부", done: true },
  { id: 2, label: "사전점검 예약", done: true },
  { id: 3, label: "QR 입장코드 발급", done: true },
  { id: 4, label: "이사 예약", done: false },
  { id: 5, label: "동의서 서명", done: false },
];

const HomePage = () => {
  const navigate = useNavigate();
  const completedCount = checklistItems.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <MobileLayout>
      {/* Greeting */}
      <div className="bg-accent text-accent-foreground rounded-xl p-5 mb-4">
        <p className="text-sm font-medium opacity-80">101동 1202호</p>
        <h2 className="text-xl font-bold mt-1">홍길동님, 환영합니다!</h2>
        <span className="inline-block mt-2 text-xs bg-primary/20 text-primary-foreground px-3 py-1 rounded-full">
          입주 예정
        </span>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-xl p-5 mb-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">입주 진행률</h3>
          <span className="text-sm font-bold text-primary">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount}/{checklistItems.length}개 항목 완료
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-card rounded-xl p-5 mb-4 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">입주 체크리스트</h3>
        <ul className="space-y-3">
          {checklistItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <span
                className={cn(
                  "text-sm",
                  item.done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {item.done && (
                <span className="ml-auto text-xs text-success font-medium">완료</span>
              )}
              {!item.done && (
                <span className="ml-auto text-xs text-warning font-medium">미완료</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* My Defect Status */}
      <div className="bg-card rounded-xl p-5 mb-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            나의 하자 처리 현황
          </h3>
          <button onClick={() => navigate("/defect")} className="text-xs text-primary flex items-center gap-0.5">
            전체보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2.5">
          {myDefects.map((d) => (
            <div key={d.id} className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{d.id}</p>
                <p className="text-[11px] text-muted-foreground">{d.type} · {d.location}</p>
              </div>
              <span className={cn("text-xs font-bold shrink-0", d.statusColor)}>{d.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/qr")}
          className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-border active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">QR 보기</span>
        </button>
        <button
          onClick={() => navigate("/payment")}
          className="flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-border active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">납부내역</span>
        </button>
      </div>
    </MobileLayout>
  );
};

export default HomePage;
