import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import BottomTabBar from "@/components/BottomTabBar";

const partners = [
  {
    name: "리더스인테리어",
    emoji: "🏠",
    features: ["아파트 전문 시공", "10년 이상 경력 보유", "자재 직수입으로 합리적 가격"],
    tags: ["풀패키지", "부분시공", "AS보장"],
    highlight: true,
  },
  {
    name: "모던하우스",
    emoji: "🛋️",
    features: ["합리적 가격 시공", "빠른 시공 일정", "3D 설계 무료 제공"],
    tags: ["가성비", "빠른시공", "3D설계"],
    highlight: false,
  },
  {
    name: "프리미엄홈",
    emoji: "✨",
    features: ["고급 자재 사용", "맞춤 설계 상담", "10년 AS 보장"],
    tags: ["프리미엄", "맞춤설계", "10년AS"],
    highlight: false,
  },
];

const InteriorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold">인테리어 파트너</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-700">
            💡 입주ON 제휴 인테리어 업체입니다. 상담 후 계약하세요.
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

            <button
              onClick={() =>
                toast.success(
                  `${p.name} 상담 신청이 완료되었습니다. 영업일 1일 내 연락드립니다.`
                )
              }
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:scale-[0.98] transition-transform"
            >
              상담 신청
            </button>
          </div>
        ))}

        <p className="text-[11px] text-muted-foreground text-center">
          * 시공 일정은 입주 지정 기간 내 협의하여 진행됩니다.
        </p>
      </div>
      <BottomTabBar />
    </div>
  );
};

export default InteriorPage;
