import { useState, useEffect } from "react";
import { CheckCircle2, Circle, QrCode, CreditCard, AlertTriangle, ChevronRight, ClipboardList, ListChecks, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

  const [defects, setDefects] = useState<DefectRow[]>([]);
  const [loadingDefects, setLoadingDefects] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: resident } = await supabase
        .from("residents")
        .select("id")
        .limit(1)
        .single();

      if (resident) {
        const { data } = await supabase
          .from("defects")
          .select("receipt_no, location, mid_category, status, is_urgent")
          .eq("resident_id", resident.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (data) setDefects(data);
      }
      setLoadingDefects(false);
    };
    load();
  }, []);

  const statusCounts = {
    접수완료: defects.filter((d) => ["미배정", "접수완료", "배정완료"].includes(d.status)).length,
    처리중: defects.filter((d) => d.status === "처리중").length,
    완료: defects.filter((d) => ["처리완료", "완료"].includes(d.status)).length,
  };

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

      {/* Defect Quick Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => navigate("/defect")}
          className="flex flex-col items-center gap-2 bg-card rounded-xl p-5 shadow-sm border border-border active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-destructive" />
          </div>
          <span className="text-sm font-bold text-foreground">하자 접수</span>
          <span className="text-[11px] text-muted-foreground">새 하자 신고하기</span>
        </button>
        <button
          onClick={() => navigate("/defect")}
          className="flex flex-col items-center gap-2 bg-card rounded-xl p-5 shadow-sm border border-border active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">나의 접수 현황</span>
          <span className="text-[11px] text-muted-foreground">처리 진행 확인</span>
        </button>
      </div>

      {/* Realtime Defect Status Summary */}
      <div className="bg-card rounded-xl p-5 mb-4 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          실시간 하자 처리 상태
        </h3>
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
      </div>

      {/* My Defect List */}
      <div className="bg-card rounded-xl p-5 mb-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">나의 하자 접수 내역</h3>
          <button onClick={() => navigate("/defect")} className="text-xs text-primary flex items-center gap-0.5">
            전체보기 <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {loadingDefects ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : defects.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">접수된 하자가 없습니다</p>
        ) : (
          <div className="space-y-2.5">
            {defects.map((d) => (
              <div key={d.receipt_no} className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{d.receipt_no}</p>
                  <p className="text-[11px] text-muted-foreground">{d.mid_category || ""} · {d.location}</p>
                </div>
                <span className={cn("text-xs font-bold shrink-0", statusColorMap[d.status] || "text-muted-foreground")}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
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
              <span className={cn("text-sm", item.done ? "text-foreground" : "text-muted-foreground")}>
                {item.label}
              </span>
              {item.done && <span className="ml-auto text-xs text-success font-medium">완료</span>}
              {!item.done && <span className="ml-auto text-xs text-warning font-medium">미완료</span>}
            </li>
          ))}
        </ul>
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
