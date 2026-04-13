import { useState, useEffect } from "react";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { WifiOff, Upload } from "lucide-react";
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

        {/* 2단계 이상: 사전점검 현황 */}
        {stage >= 2 && <InspectionCard />}

        {/* 3단계: 이사예약 현황 */}
        {stage === 3 && <MovingReservationCard />}

        {/* 4단계: 잔금납부 확인 신청 */}
        {stage === 4 && (
          <div className="bg-[#F0F6FF] rounded-xl p-4 mb-4 border border-blue-100">
            <p className="text-sm font-semibold text-foreground mb-1">
              📋 잔금납부 확인 신청
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              납부 영수증을 업로드하고 납부완료를 신청해 주세요
            </p>
            <button
              onClick={() => navigate("/payment")}
              className="text-xs text-blue-700 underline"
            >
              납부 확인 신청하러 가기 →
            </button>
          </div>
        )}

        {/* 2~5단계: 하자 접수 카드 */}
        {stage >= 2 && <DefectCard defects={defects} loadingDefects={loadingDefects} />}

        {/* 공지사항 - 모든 단계 공통 */}
        <NoticeSection />

        {/* 단계별 진행 가이드 */}
        <StageGuide stage={stage} />
      </div>
    </MobileLayout>
  );
};

export default HomePage;
