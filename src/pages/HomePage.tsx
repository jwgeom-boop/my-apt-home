import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ChevronRight, Loader2, WifiOff, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useOfflineDrafts } from "@/hooks/useOfflineDrafts";
import { useStage } from "@/hooks/useStage";
import BannerSection from "@/components/home/BannerSection";
import NoticeSection from "@/components/home/NoticeSection";
import InspectionCard from "@/components/home/InspectionCard";
import MovingReservationCard from "@/components/home/MovingReservationCard";
import PaymentCard from "@/components/home/PaymentCard";
import DefectCard from "@/components/home/DefectCard";

interface DefectRow {
  receipt_no: string;
  location: string;
  mid_category: string | null;
  status: string;
  is_urgent: boolean;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { drafts, syncAll, syncing } = useOfflineDrafts();
  const { stage } = useStage();

  const getChecklistItems = () => [
    { id: 1, label: "잔금 납부", done: true, path: "/payment" },
    { id: 2, label: "사전점검 예약", done: true, path: "/reservation" },
    { id: 3, label: "QR 입장코드 발급", done: true, path: "/qr" },
    { id: 4, label: "이사 예약", done: localStorage.getItem("moveInReserved") === "true", path: "/reservation" },
    { id: 5, label: "동의서 서명", done: localStorage.getItem("consentSigned") === "true", path: "/consent" },
  ];

  const checklistItems = getChecklistItems();
  const completedCount = checklistItems.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  const [defects, setDefects] = useState<DefectRow[]>([]);
  const [loadingDefects, setLoadingDefects] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showMoveInGuide, setShowMoveInGuide] = useState(false);

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
          .limit(10);

        if (data) setDefects(data);
      }
      setLoadingDefects(false);
    };
    load();
  }, []);

  const targetDate = new Date("2026-04-26");
  const today = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dday = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day" : `D+${Math.abs(diffDays)}`;

  const readinessPercent = 45;

  const stepsData: { label: string; status: "completed" | "current" | "pending" }[] = [
    { label: "계약", status: stage > 1 ? "completed" : stage === 1 ? "current" : "pending" },
    { label: "사전점검", status: stage > 2 ? "completed" : stage === 2 ? "current" : "pending" },
    { label: "이사예약", status: stage > 3 ? "completed" : stage === 3 ? "current" : "pending" },
    { label: "잔금납부", status: stage > 4 ? "completed" : stage === 4 ? "current" : "pending" },
    { label: "입주", status: stage >= 5 ? "completed" : "pending" },
  ];

  return (
    <MobileLayout>
      {/* 배너 - 모든 단계 공통 */}
      <BannerSection steps={stepsData} readinessPercent={readinessPercent} dday={dday} />

      {/* Offline drafts sync banner */}
      {drafts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-amber-800">📱 임시 저장: {drafts.length}건</p>
              <p className="text-[10px] text-amber-600">전송 대기 중인 하자 접수가 있습니다</p>
            </div>
          </div>
          <button
            onClick={syncAll}
            disabled={syncing}
            className="flex items-center gap-1 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 disabled:opacity-50"
          >
            <Upload className="w-3 h-3" />
            {syncing ? "전송 중..." : "일괄 전송"}
          </button>
        </div>
      )}

      {/* 2단계: 사전점검 현황 */}
      {stage === 2 && <InspectionCard />}

      {/* 3단계: 이사예약 현황 */}
      {stage === 3 && <MovingReservationCard />}

      {/* 4단계: 잔금납부 현황 */}
      {stage === 4 && <PaymentCard />}

      {/* 3~5단계: 하자 접수 카드 */}
      {stage >= 3 && <DefectCard defects={defects} loadingDefects={loadingDefects} />}

      {/* 공지사항 - 모든 단계 공통 */}
      <NoticeSection />

      {/* Progress - 클릭하면 체크리스트 표시 */}
      <button
        onClick={() => setShowChecklist(true)}
        className="w-full bg-card rounded-xl p-4 mb-3 shadow-sm border border-border text-left active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">입주 진행률</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">{progressPercent}%</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2">
          {completedCount}/{checklistItems.length}개 항목 완료
        </p>
      </button>

      {/* 입주 당일 가이드 */}
      <button
        onClick={() => setShowMoveInGuide(true)}
        className="w-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-left active:scale-[0.99] transition-transform mt-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <span className="text-lg">🏠</span>
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">입주 당일 가이드</p>
            <p className="text-[10px] text-muted-foreground">준비할 것들을 확인하세요</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
        </div>
      </button>

      {/* 입주 체크리스트 슬라이드 패널 */}
      {showChecklist && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowChecklist(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[75vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">입주 체크리스트</h3>
              <button onClick={() => setShowChecklist(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{completedCount}/{checklistItems.length}개 완료</span>
                <span className="text-lg font-bold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3 mb-5" />
              <ul className="space-y-3">
                {checklistItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                    {item.done ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={cn("text-sm flex-1", item.done ? "text-foreground" : "text-muted-foreground")}>
                      {item.label}
                    </span>
                    {item.done ? (
                      <span className="text-xs font-bold text-success">완료</span>
                    ) : (
                      <button
                        onClick={() => {
                          setShowChecklist(false);
                          navigate(item.path);
                        }}
                        className="text-xs font-bold text-primary border border-primary/40 bg-primary/10 px-2.5 py-1 rounded-lg active:scale-95 transition-transform"
                      >
                        바로가기 →
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 입주 당일 가이드 슬라이드 패널 */}
      {showMoveInGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMoveInGuide(false)} />
          <div className="relative w-full max-w-[390px] bg-background rounded-t-2xl shadow-xl animate-slide-up max-h-[85vh] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h3 className="text-base font-bold text-foreground">🏠 입주 당일 가이드</h3>
              <button onClick={() => setShowMoveInGuide(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {[
                  { step: "01", icon: "🔑", title: "열쇠 수령", desc: "입주지원센터 방문 → 신분증 + 입주증 지참" },
                  { step: "02", icon: "🚗", title: "주차 배정 확인", desc: "배정 주차구역 확인 후 차량 이동" },
                  { step: "03", icon: "🔥", title: "가스 개통 신청", desc: "도시가스 앱 또는 전화 신청 (당일 가능)" },
                  { step: "04", icon: "💡", title: "전기·수도 명의 변경", desc: "한전 고객센터 123 / 수도사업소 연락" },
                  { step: "05", icon: "📦", title: "이사 완료 후 공용부 확인", desc: "엘리베이터·복도 파손 여부 확인" },
                  { step: "06", icon: "💰", title: "관리비 예치금 납부", desc: "미납 시 앱 납부 탭에서 확인" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{item.step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                <p className="text-xs text-muted-foreground">💡 문의: 입주지원센터 1588-0000 (평일 09~18시)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default HomePage;
