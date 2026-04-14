import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import BottomTabBar from "@/components/BottomTabBar";

const GUIDE_TABS = ["잔금·등기", "입주당일", "행정처리", "공과금"];
const GUIDE_DATA: Record<string, { icon: string; title: string; desc: string }[]> = {
  "잔금·등기": [
    { icon: "🏦", title: "잔금대출 실행", desc: "은행 방문 후 대출을 실행하세요." },
    { icon: "💰", title: "잔금 납부", desc: "대출금 + 자기자금으로 시행사에 납부하세요." },
    { icon: "📝", title: "취득세 납부", desc: "잔금일로부터 60일 이내 필수 납부." },
    { icon: "🏛️", title: "소유권 이전 등기", desc: "취득세 영수증 지참 후 법무사 선임." },
    { icon: "📄", title: "등기부등본 확인", desc: "등기 완료 후 소유권을 최종 확인하세요." },
  ],
  "입주당일": [
    { icon: "🔑", title: "열쇠 수령", desc: "관리사무소 방문 시 입주증을 지참하세요." },
    { icon: "🔍", title: "하자 점검", desc: "각 공간을 꼼꼼히 점검하고 즉시 접수하세요." },
    { icon: "📸", title: "상태 촬영", desc: "하자 부위는 사진으로 촬영해 보관하세요." },
    { icon: "🚗", title: "주차 등록", desc: "관리사무소에 차량번호를 등록하세요." },
    { icon: "📦", title: "이사 예약 확인", desc: "엘리베이터 사용 시간을 확인하세요." },
  ],
  "행정처리": [
    { icon: "🏠", title: "전입신고 (14일 이내)", desc: "주민센터 또는 정부24에서 신고하세요." },
    { icon: "📋", title: "확정일자", desc: "전입신고 시 동시에 받으세요." },
    { icon: "💡", title: "관리비 등록", desc: "입주 즉시 관리사무소에 방문하세요." },
    { icon: "📮", title: "주소 변경", desc: "은행·보험·카드사 주소를 변경하세요." },
  ],
  "공과금": [
    { icon: "💡", title: "전기 신규 가입", desc: "한국전력공사에 신규 가입하세요." },
    { icon: "🔥", title: "가스 개통", desc: "도시가스 고객센터에 개통 신청하세요." },
    { icon: "💧", title: "수도 확인", desc: "관리사무소에서 확인하세요." },
    { icon: "📺", title: "인터넷/TV 개통", desc: "원하는 통신사에 개통 신청하세요." },
  ],
};

const CARDS = [
  { key: "notice", emoji: "📢", iconBg: "#FF6B7A", title: "공지사항", sub: "최신 소식 확인", path: "/notice" },
  { key: "inspect", emoji: "🔍", iconBg: "#4A90D9", title: "사전점검", sub: "예약 및 현황 확인", path: "/reservation" },
  { key: "partner", emoji: "🤝", iconBg: "#4CAF82", title: "제휴업체", sub: "인테리어·이사·가전·금융", path: "/services" },
  { key: "movein", emoji: "🏠", iconBg: "#F5A623", title: "입주", sub: "입주 가이드 및 정보", path: "" },
];

const MOVE_IN_DATE = new Date("2026-05-15");

export default function HomePage() {
  const navigate = useNavigate();
  const [dong, setDong] = useState("---");
  const [ho, setHo] = useState("---");
  const [moveInDate, setMoveInDate] = useState("입주일 미정");
  const [dday, setDday] = useState("D-?");
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("잔금·등기");

  useEffect(() => {
    const load = async () => {
      try {
        const { data: resident } = await supabase
          .from("residents")
          .select("unit_number, complex_name")
          .limit(1)
          .single();
        if (resident) {
          setDong(resident.unit_number?.split("동")?.[0] || "---");
          setHo(resident.unit_number?.split("동")?.[1]?.replace("호", "") || "---");
          const date = MOVE_IN_DATE;
          const diff = Math.ceil((date.getTime() - Date.now()) / 86400000);
          setDday(diff > 0 ? `D-${diff}` : diff === 0 ? "D-Day" : `D+${Math.abs(diff)}`);
          setMoveInDate("2026.05.15");
        }
      } catch {
        // defaults already set
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-[390px] min-h-screen relative flex flex-col">
      {/* 배경 이미지 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 1,
        }}
      />

      {/* 헤더 바 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {loading ? (
          <>
            <Skeleton className="w-24 h-5 bg-white/20 rounded" />
            <Skeleton className="w-36 h-4 bg-white/20 rounded" />
          </>
        ) : (
          <>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
              {dong}동 {ho}호
            </span>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
              📅 {moveInDate} 입주예정 ({dday})
            </span>
          </>
        )}
      </div>

      {/* 상단 배경 노출 영역 */}
      <div style={{ position: "relative", zIndex: 10, height: 40 }} />

      {/* 카드 그리드 */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "200px 200px",
          gap: 12,
          padding: "0 16px",
        }}
      >
        {CARDS.map((card) => (
          <button
            key={card.key}
            onClick={() => {
              if (card.key === "movein") {
                setActiveTab("잔금·등기");
                setShowGuide(true);
              } else {
                navigate(card.path);
              }
            }}
            style={{
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
              display: "flex",
              flexDirection: "column" as const,
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              transition: "transform 0.15s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              {card.emoji}
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#111", fontSize: 17, fontWeight: 800 }}>{card.title}</p>
              <p style={{ color: "#888", fontSize: 11, marginTop: 2, whiteSpace: "nowrap" }}>{card.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 하단 배경 노출 영역 */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, minHeight: 80 }} />

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-40">
        <BottomTabBar />
      </div>

      {/* 입주 가이드 패널 */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowGuide(false)}
          />
          <div
            style={{
              position: "relative",
              background: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "calc(100vh - 80px)",
              display: "flex",
              flexDirection: "column" as const,
              marginBottom: 68,
            }}
          >
            {/* 드래그 핸들 */}
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#ddd" }} />
            </div>

            {/* 제목 */}
            <div style={{ padding: "4px 20px 12px" }}>
              <p style={{ fontSize: 16, fontWeight: 800 }}>🚀 입주 준비 가이드</p>
            </div>

            {/* 탭 */}
            <div style={{ display: "flex", gap: 8, padding: "0 20px 16px", overflowX: "auto" }}>
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                    background: activeTab === tab ? "#2563EB" : "#f0f0f0",
                    color: activeTab === tab ? "#fff" : "#666",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 가이드 리스트 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 32px" }}>
              {GUIDE_DATA[activeTab].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    background: "#f8f9fa",
                    borderRadius: 14,
                    padding: "12px 14px",
                    marginBottom: 10,
                    border: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(37,99,235,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.desc}</p>
                  </div>
                  <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600, flexShrink: 0 }}>
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
}
