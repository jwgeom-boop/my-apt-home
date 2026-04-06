import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Info } from "lucide-react";

const companies = [
  {
    logo: "짐무",
    name: "짐무버 이사",
    phone: "1588-0000",
    desc: "포장이사 전문 · 파손보상 100%",
    tags: ["포장이사", "보험적용", "24시간"],
  },
  {
    logo: "다이사",
    name: "다이사 플랫폼",
    phone: "1600-1234",
    desc: "이사 견적 비교 · 최대 30% 절약",
    tags: ["가격비교", "후기검증", "포장이사"],
  },
  {
    logo: "용달",
    name: "빠른용달 소형이사",
    phone: "1661-5678",
    desc: "원룸·소형 이사 당일 출발 가능",
    tags: ["소형이사", "당일배차", "보험적용"],
  },
];

const MovingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">이사업체 파트너</span>
      </div>

      <div className="px-4 pt-4 pb-24">
        {/* 안내 배너 */}
        <div className="flex items-start gap-2 bg-primary/10 rounded-xl p-3 mb-4">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary">
            입주 지정 이사업체 목록입니다. 직접 연락하여 예약하세요.
          </p>
        </div>

        {/* 업체 카드 리스트 */}
        <div className="space-y-3">
          {companies.map((c, i) => (
            <div key={i} className="bg-card rounded-xl shadow-sm border border-border p-4 flex gap-3 relative">
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-destructive/10 text-destructive rounded px-1">AD</span>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted-foreground">{c.logo}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                  <Phone className="w-3 h-3" />
                  {c.phone}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <p className="text-[11px] text-muted-foreground mt-4 text-center">
          * 이사 예약은 예약 페이지에서 별도 진행합니다.
        </p>
      </div>
    </div>
  );
};

export default MovingPage;
