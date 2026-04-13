import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const partners = [
  {
    name: "빠른이사",
    emoji: "🚚",
    phone: "1588-1234",
    features: ["24시간 운영 가능", "보험 적용 포장이사", "포장이사 전문 업체"],
    tags: ["포장이사", "24시간", "보험적용"],
    highlight: true,
  },
  {
    name: "안전이사",
    emoji: "📦",
    phone: "1588-5678",
    features: ["파손 보상 100% 적용", "당일 이사 가능", "가격 투명 공개"],
    tags: ["파손보상", "당일가능", "투명가격"],
    highlight: false,
  },
  {
    name: "프로이사",
    emoji: "🏠",
    phone: "1588-9999",
    features: ["대형 트럭 다수 보유", "장거리 이사 가능", "특수 이사 전문"],
    tags: ["대형트럭", "장거리", "특수이사"],
    highlight: false,
  },
];

const MovingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold">이사업체 파트너</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-700">
            💡 입주ON 제휴 이사업체입니다. 이사 예약은 예약 페이지에서 별도 진행하세요.
          </p>
        </div>

        {partners.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl p-4 border ${
              p.highlight ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{p.emoji}</span>
              <span className="text-sm font-bold text-foreground">{p.name}</span>
              {p.highlight && (
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                  추천
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {p.tags.map((t) => (
                <span key={t} className="text-[11px] bg-muted rounded px-2 py-1">{t}</span>
              ))}
            </div>

            <ul className="space-y-1 mb-3">
              {p.features.map((f, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-success font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={`tel:${p.phone}`}
              className="flex items-center justify-center w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:scale-[0.98] transition-transform"
            >
              전화 문의
            </a>
          </div>
        ))}

        <p className="text-[11px] text-muted-foreground text-center">
          * 이사 날짜 예약은 상단 예약 메뉴에서 진행해주세요.
        </p>
      </div>
      <BottomTabBar />
    </div>
  );
};

export default MovingPage;
