import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Partner {
  logo: string;
  name: string;
  desc: string;
  tags: string[];
  buttonLabel: string;
  action: () => void;
}

interface CategoryItem {
  emoji: string;
  label: string;
  desc: string;
  key: string;
}

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: CategoryItem[] = [
    { emoji: "🏦", label: "잔금대출", desc: "협약 은행 금리 비교", key: "loan" },
    { emoji: "⚖️", label: "법무·등기", desc: "소유권이전 대행", key: "registry" },
    { emoji: "🛋️", label: "인테리어", desc: "입주 시공·청소", key: "interior" },
    { emoji: "🚚", label: "이사업체", desc: "포장이사 견적 비교", key: "moving" },
    { emoji: "🏠", label: "가전·가구", desc: "입주 패키지 할인", key: "appliance" },
  ];

  const partnersMap: Record<string, Partner[]> = {
    loan: [
      { logo: "KB", name: "KB국민은행", desc: "최저 연 3.8% · 한도 최대 5억", tags: ["잔금대출", "중도금전환"], buttonLabel: "상담 신청", action: () => navigate("/loan") },
      { logo: "신한", name: "신한은행", desc: "최저 연 3.9% · 비대면 신청 가능", tags: ["잔금대출", "전세자금"], buttonLabel: "상담 신청", action: () => navigate("/loan") },
      { logo: "하나", name: "하나은행", desc: "최저 연 4.0% · 입주자 우대혜택", tags: ["잔금대출"], buttonLabel: "상담 신청", action: () => navigate("/loan") },
      { logo: "우리", name: "우리은행", desc: "최저 연 4.1% · 모바일 간편 신청", tags: ["잔금대출"], buttonLabel: "상담 신청", action: () => navigate("/loan") },
    ],
    registry: [
      { logo: "법무", name: "스마트등기 법무사사무소", desc: "소유권이전등기 전문 · 비대면 완결", tags: ["소유권이전", "근저당설정"], buttonLabel: "신청하기", action: () => navigate("/registry") },
      { logo: "로앤", name: "로앤 법무그룹", desc: "입주 특화 법무서비스 · 빠른 처리", tags: ["등기대행", "계약검토"], buttonLabel: "신청하기", action: () => navigate("/registry") },
    ],
    interior: [
      { logo: "오늘", name: "오늘의집 인테리어", desc: "신축 입주청소 + 시공 패키지", tags: ["풀패키지", "입주청소"], buttonLabel: "견적 보기", action: () => navigate("/interior") },
      { logo: "집닥", name: "집닥 인테리어", desc: "평수별 맞춤 견적 · 3개사 비교", tags: ["비교견적", "AS보장"], buttonLabel: "견적 보기", action: () => navigate("/interior") },
      { logo: "한샘", name: "한샘 리하우스", desc: "부엌·욕실 전문 리모델링 패키지", tags: ["부엌", "욕실", "붙박이장"], buttonLabel: "견적 보기", action: () => navigate("/interior") },
    ],
    moving: [
      { logo: "짐무", name: "짐무버 이사", desc: "포장이사 전문 · 파손보상 100%", tags: ["포장이사", "보상보장"], buttonLabel: "견적 보기", action: () => navigate("/moving") },
      { logo: "다이사", name: "다이사 플랫폼", desc: "이사 견적 비교 · 최대 30% 절약", tags: ["가격비교", "후기검증"], buttonLabel: "견적 보기", action: () => navigate("/moving") },
      { logo: "용달", name: "빠른용달 소형이사", desc: "원룸·소형 이사 당일 출발 가능", tags: ["소형이사", "당일배차"], buttonLabel: "견적 보기", action: () => navigate("/moving") },
    ],
    appliance: [
      { logo: "삼성", name: "삼성전자 입주 패키지", desc: "냉장고·세탁기·에어컨 세트 할인", tags: ["가전세트", "배송설치"], buttonLabel: "상품 보기", action: () => toast.success("삼성전자 페이지로 이동합니다") },
      { logo: "LG", name: "LG전자 신혼 패키지", desc: "오브제컬렉션 · 36개월 무이자", tags: ["무이자할부", "오브제"], buttonLabel: "상품 보기", action: () => toast.success("LG전자 페이지로 이동합니다") },
      { logo: "이케아", name: "이케아 입주 특별전", desc: "거실·침실 풀패키지 구성 상담", tags: ["가구", "소품"], buttonLabel: "상품 보기", action: () => toast.success("이케아 페이지로 이동합니다") },
    ],
  };

  const categoryLabels: Record<string, string> = {
    loan: "잔금대출",
    registry: "법무·등기",
    interior: "인테리어",
    moving: "이사업체",
    appliance: "가전·가구",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        {selectedCategory ? (
          <>
            <button onClick={() => setSelectedCategory(null)} className="active:scale-90 transition-transform">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold">{categoryLabels[selectedCategory]}</span>
          </>
        ) : (
          <span className="text-sm font-bold">입주 준비 서비스</span>
        )}
      </div>

      <div className="px-4 pt-4 pb-24">
        {!selectedCategory ? (
          <>
            <p className="text-xs text-muted-foreground mb-4">필요한 서비스를 선택하세요</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className="bg-card rounded-2xl shadow-sm border border-border p-5 flex flex-col items-center text-center active:scale-[0.97] transition-transform"
                >
                  <span className="text-4xl mb-2">{cat.emoji}</span>
                  <span className="text-sm font-bold text-foreground">{cat.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{cat.desc}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3 mt-2">
            {partnersMap[selectedCategory]?.map((p, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm border border-border p-4 flex gap-3 relative">
                {/* AD badge */}
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-destructive/10 text-destructive rounded px-1">AD</span>
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">{p.logo}</span>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                  <button onClick={p.action} className="text-xs text-primary font-semibold mt-2 underline">
                    {p.buttonLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
