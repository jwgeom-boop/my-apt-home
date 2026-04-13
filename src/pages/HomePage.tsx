import { useState, useEffect } from "react";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { WifiOff, Upload, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useOfflineDrafts } from "@/hooks/useOfflineDrafts";
import { useStage } from "@/hooks/useStage";
import BannerSection from "@/components/home/BannerSection";
import NoticeSection from "@/components/home/NoticeSection";
import InspectionCard from "@/components/home/InspectionCard";
import MovingReservationCard from "@/components/home/MovingReservationCard";
import DefectCard from "@/components/home/DefectCard";
import StageGuide from "@/components/home/StageGuide";

const GUIDE_TABS = ["잔금·등기", "입주당일", "행정처리", "공과금"];

const GUIDE_DATA: Record<string, { icon: string; title: string; desc: string }[]> = {
  "잔금·등기": [
    { icon: "🏦", title: "잔금대출 실행", desc: "은행 방문 후 대출을 실행하세요. 대출금이 시행사 계좌로 입금됩니다." },
    { icon: "💰", title: "잔금 납부", desc: "대출금 + 자기자금으로 시행사에 잔금을 납부하세요." },
    { icon: "📝", title: "취득세 납부", desc: "잔금일로부터 60일 이내 필수 납부. 기한 초과 시 가산세가 부과됩니다." },
    { icon: "🏛️", title: "소유권 이전 등기", desc: "취득세 영수증 지참 후 법무사 선임 또는 직접 신청하세요." },
    { icon: "📄", title: "등기부등본 확인", desc: "등기 완료 후 등기부등본을 발급받아 소유권을 최종 확인하세요." },
  ],
  "입주당일": [
    { icon: "🔑", title: "열쇠 수령", desc: "관리사무소 방문 시 입주증을 지참하고 열쇠를 수령하세요." },
    { icon: "🔍", title: "하자 점검", desc: "입주 전 각 공간을 꼼꼼히 점검하고 하자 발견 즉시 접수하세요." },
    { icon: "📸", title: "상태 촬영", desc: "하자 부위는 사진으로 촬영해 증거를 보관하세요." },
    { icon: "🚗", title: "주차 등록", desc: "관리사무소에 차량번호를 등록하세요." },
    { icon: "📦", title: "이사 예약 확인", desc: "엘리베이터 사용 시간 및 구역을 사전에 확인하세요." },
  ],
  "행정처리": [
    { icon: "🏠", title: "전입신고 (14일 이내)", desc: "입주 후 14일 이내 주민센터 또는 정부24에서 신고하세요." },
    { icon: "📋", title: "확정일자", desc: "전입신고 시 동시에 확정일자를 받아 임차인 권리를 보호하세요." },
    { icon: "💡", title: "관리비 등록", desc: "입주 즉시 관리사무소에 방문해 관리비 계정을 등록하세요." },
    { icon: "📮", title: "주소 변경", desc: "은행·보험·카드사 등 각종 주소를 새 주소로 변경하세요." },
  ],
  "공과금": [
    { icon: "💡", title: "전기 신규 가입", desc: "한국전력공사에 신규 가입 신청을 하세요." },
    { icon: "🔥", title: "가스 개통", desc: "도시가스 고객센터에 연락해 개통 신청을 하세요." },
    { icon: "💧", title: "수도 확인", desc: "수도 연결 여부를 관리사무소에서 확인하세요." },
    { icon: "📺", title: "인터넷/TV 개통", desc: "원하는 통신사에 연락해 인터넷·TV 개통을 신청하세요." },
  ],
};

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

  const [defects, setDefects] = useState<DefectRow[]>([]);
  const [loadingDefects, setLoadingDefects] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState("잔금·등기");

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

  const readinessPercent = stage * 20;

  const stepsData: { label: string; status: "completed" | "current" | "pending" }[] = [
    { label: "계약", status: stage > 1 ? "completed" : stage === 1 ? "current" : "pending" },
    { label: "사전점검", status: stage > 2 ? "completed" : stage === 2 ? "current" : "pending" },
    { label: "이사예약", status: stage > 3 ? "completed" : stage === 3 ? "current" : "pending" },
    { label: "잔금납부", status: stage > 4 ? "completed" : stage === 4 ? "current" : "pending" },
    { label: "입주", status: stage >= 5 ? "completed" : "pending" },
  ];

  if (loadingDefects) {
    return (
      <MobileLayout>
        <HomePageSkeleton />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="animate-fade-in-content">
        <BannerSection steps={stepsData} readinessPercent={readinessPercent} dday={dday} />

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

        {stage === 2 && <InspectionCard />}
        {stage === 3 && <MovingReservationCard />}

        {stage === 4 && (
          <div className="bg-[#F0F6FF] rounded-xl p-4 mb-4 border border-blue-100">
            <p className="text-sm font-semibold text-foreground mb-1">📋 잔금납부 확인 신청</p>
            <p className="text-xs text-muted-foreground mb-2">납부 영수증을 업로드하고 납부완료를 신청해 주세요</p>
            <button onClick={() => navigate("/payment")} className="text-xs text-blue-700 underline">
              납부 확인 신청하러 가기 →
            </button>
          </div>
        )}

        {stage >= 2 && <DefectCard defects={defects} loadingDefects={loadingDefects} />}

        <NoticeSection />

        <StageGuide stage={stage} />

        {/* 입주 준비 가이드 버튼 */}
        <button
          onClick={() => { setActiveGuideTab("잔금·등기"); setShowGuide(true); }}
          className="w-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-left mt-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🚀</span>
            <div>
              <p className="text-sm font-bold">입주 준비 가이드</p>
              <p className="text-xs text-muted-foreground">잔금·등기·행정처리·공과금 안내</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
          </div>
        </button>
      </div>

      {/* Bottom Sheet Overlay */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGuide(false)} />
          <div className="relative bg-card rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-foreground">🚀 입주 준비 가이드</h2>
              <button onClick={() => setShowGuide(false)} className="p-1 rounded-full hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGuideTab(tab)}
                  className={cn(
                    "shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
                    activeGuideTab === tab
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-8 space-y-3">
              {GUIDE_DATA[activeGuideTab].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-muted/30 rounded-xl px-4 py-3 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-base">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default HomePage;
