import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BottomTabBar from "@/components/BottomTabBar";

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

const MOVE_IN_DATE = new Date("2026-05-15");

function getDday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(MOVE_IN_DATE);
  target.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `D-${diff}`;
  if (diff === 0) return "D-DAY";
  return `D+${Math.abs(diff)}`;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [unitInfo, setUnitInfo] = useState<{ unit: string; moveInDate: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState("잔금·등기");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: resident } = await supabase
          .from("residents")
          .select("unit_number, complex_name")
          .limit(1)
          .single();

        if (resident) {
          setUnitInfo({
            unit: resident.unit_number || "---동 ---호",
            moveInDate: "2026.05.15",
          });
        } else {
          setUnitInfo({ unit: "---동 ---호", moveInDate: "입주일 미정" });
        }
      } catch {
        setUnitInfo({ unit: "---동 ---호", moveInDate: "입주일 미정" });
      }
      setLoading(false);
    };
    load();
  }, []);

  const dday = getDday();

  const cards = [
    {
      emoji: "📢", title: "공지사항", sub: "최신 공지 확인",
      iconBg: "bg-[#FFE8EC]", badge: "NEW 2",
      action: () => navigate("/notice"),
    },
    {
      emoji: "🔍", title: "사전점검", sub: "정밀 하자 및 예약 관리",
      iconBg: "bg-[#E8F4FF]",
      action: () => navigate("/reservation"),
    },
    {
      emoji: "🤝", title: "제휴업체", sub: "인테리어/이사/가전/금융 안내",
      iconBg: "bg-[#E8FFF0]",
      action: () => navigate("/services"),
    },
    {
      emoji: "🏠", title: "입주", sub: "입주 준비 가이드 및 정보",
      iconBg: "bg-[#FFF3E8]",
      action: () => { setActiveGuideTab("잔금·등기"); setShowGuide(true); },
    },
  ];

  return (
    <div className="mx-auto max-w-[390px] min-h-screen relative flex flex-col bg-gradient-to-b from-[#0a1428] to-[#1a3a5c]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <div className="px-5 pt-3 pb-4">
          {loading ? (
            <>
              <Skeleton className="w-32 h-7 bg-white/20 rounded" />
              <Skeleton className="w-44 h-4 bg-white/20 rounded mt-2" />
            </>
          ) : (
            <>
              <h1 className="text-white text-xl font-extrabold tracking-tight">
                {unitInfo?.unit}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/70 text-xs">
                  {unitInfo?.moveInDate} 입주예정
                </span>
                <span className="bg-white/20 text-[#5BC8FF] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#5BC8FF]/40">
                  {dday}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 2x2 Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3 px-4 pb-[calc(68px+16px)]">
          {cards.map((card) => (
            <button
              key={card.title}
              onClick={card.action}
              className="bg-white/90 backdrop-blur-md rounded-[22px] shadow-xl border border-white/60 flex flex-col justify-end p-4 relative overflow-hidden active:scale-[0.97] transition-transform cursor-pointer text-left"
            >
              {/* Badge */}
              {card.badge && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}

              {/* Icon */}
              <div className={cn("absolute top-3 right-3 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl", card.iconBg)}>
                {card.emoji}
              </div>

              {/* Text */}
              <p className="text-[#0f1923] text-[17px] font-extrabold mt-9 tracking-tight">{card.title}</p>
              <p className="text-gray-500 text-[11px] mt-1 leading-relaxed">{card.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40">
        <BottomTabBar />
      </div>

      {/* Guide Bottom Sheet */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowGuide(false)} />
          <div className="relative bg-card rounded-t-2xl max-h-[calc(100vh-80px)] flex flex-col animate-slide-up mb-[68px]">
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-base font-bold text-foreground">🚀 입주 준비 가이드</h2>
              <button onClick={() => setShowGuide(false)} className="p-1 rounded-full hover:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex gap-2 px-5 pb-4 overflow-x-auto">
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveGuideTab(tab)}
                  className={cn(
                    "shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
                    activeGuideTab === tab ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

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
    </div>
  );
};

export default HomePage;
