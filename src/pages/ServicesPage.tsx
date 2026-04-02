import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Partner {
  logo: string;
  logoColor: string;
  name: string;
  desc: string;
  tags: string[];
  btnLabel: string;
  action: () => void;
}

interface Category {
  icon: string;
  title: string;
  partners: Partner[];
}

const ServicesPage = () => {
  const navigate = useNavigate();

  const categories: Category[] = [
    {
      icon: "🏦",
      title: "은행·대출",
      partners: [
        { logo: "KB", logoColor: "bg-amber-500", name: "KB국민은행 잔금대출", desc: "최저 연 3.8% · 한도 최대 5억", tags: ["잔금대출", "중도금전환"], btnLabel: "바로가기", action: () => navigate("/loan") },
        { logo: "신한", logoColor: "bg-blue-600", name: "신한은행 주택담보대출", desc: "최저 연 3.9% · 비대면 신청 가능", tags: ["잔금대출", "전세자금"], btnLabel: "바로가기", action: () => navigate("/loan") },
        { logo: "하나", logoColor: "bg-teal-600", name: "하나은행 입주자 특별금리", desc: "최저 연 4.0% · 입주자 우대혜택", tags: ["잔금대출"], btnLabel: "바로가기", action: () => navigate("/loan") },
      ],
    },
    {
      icon: "⚖️",
      title: "법무·등기",
      partners: [
        { logo: "법무", logoColor: "bg-indigo-600", name: "스마트등기 법무사사무소", desc: "소유권이전등기 전문 · 비대면 완결", tags: ["소유권이전", "근저당설정"], btnLabel: "바로가기", action: () => navigate("/registry") },
        { logo: "로앤", logoColor: "bg-slate-700", name: "로앤 법무그룹", desc: "입주 특화 법무서비스 · 빠른 처리", tags: ["등기대행", "계약검토"], btnLabel: "바로가기", action: () => navigate("/registry") },
      ],
    },
    {
      icon: "🛋️",
      title: "인테리어",
      partners: [
        { logo: "오늘", logoColor: "bg-sky-500", name: "오늘의집 인테리어", desc: "신축 아파트 입주청소 + 시공 패키지", tags: ["풀패키지", "입주청소"], btnLabel: "견적 보기", action: () => navigate("/interior") },
        { logo: "집닥", logoColor: "bg-orange-500", name: "집닥 인테리어", desc: "평수별 맞춤 견적 · 3개사 비교", tags: ["비교견적", "AS보장"], btnLabel: "견적 보기", action: () => navigate("/interior") },
        { logo: "한샘", logoColor: "bg-red-600", name: "한샘 리하우스", desc: "부엌·욕실 전문 리모델링 패키지", tags: ["부엌", "욕실", "붙박이장"], btnLabel: "견적 보기", action: () => navigate("/interior") },
      ],
    },
    {
      icon: "🚚",
      title: "이사업체",
      partners: [
        { logo: "짐무", logoColor: "bg-green-600", name: "짐무버 이사", desc: "포장이사 전문 · 파손보상 100%", tags: ["포장이사", "보상보장"], btnLabel: "견적 보기", action: () => navigate("/moving") },
        { logo: "이사", logoColor: "bg-violet-600", name: "다이사 플랫폼", desc: "이사 견적 비교 · 최대 30% 절약", tags: ["가격비교", "후기검증"], btnLabel: "견적 보기", action: () => navigate("/moving") },
        { logo: "용달", logoColor: "bg-yellow-600", name: "빠른용달 소형이사", desc: "원룸·소형 이사 당일 출발 가능", tags: ["소형이사", "당일배차"], btnLabel: "견적 보기", action: () => navigate("/moving") },
      ],
    },
    {
      icon: "🏠",
      title: "가전·가구",
      partners: [
        { logo: "삼성", logoColor: "bg-blue-800", name: "삼성전자 입주 패키지", desc: "냉장고·세탁기·에어컨 세트 할인", tags: ["가전세트", "배송설치"], btnLabel: "상품 보기", action: () => toast.success("삼성전자 입주 패키지 페이지로 이동합니다") },
        { logo: "LG", logoColor: "bg-rose-600", name: "LG전자 신혼 패키지", desc: "오브제컬렉션 · 36개월 무이자", tags: ["무이자할부", "오브제"], btnLabel: "상품 보기", action: () => toast.success("LG전자 입주 패키지 페이지로 이동합니다") },
        { logo: "이케", logoColor: "bg-yellow-500", name: "이케아 입주 특별전", desc: "거실·침실 풀패키지 구성 상담", tags: ["가구", "소품"], btnLabel: "상품 보기", action: () => toast.success("이케아 입주 특별전 페이지로 이동합니다") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">입주 준비 서비스</span>
      </div>

      <div className="px-4 pt-4 pb-24">
        {/* Subtitle */}
        <p className="text-xs text-muted-foreground mb-2">믿을 수 있는 파트너사를 한곳에서</p>

        {categories.map((cat, ci) => (
          <div key={ci}>
            <h2 className={`text-base font-bold text-foreground mb-2 ${ci > 0 ? "mt-6" : "mt-2"}`}>
              {cat.icon} {cat.title}
            </h2>
            <div className="space-y-3">
              {cat.partners.map((p, pi) => (
                <div key={pi} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                  {/* Top row: logo + AD badge */}
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-10 h-10 rounded-lg ${p.logoColor} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{p.logo}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">AD</span>
                  </div>
                  {/* Name + desc */}
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{t}</span>
                    ))}
                  </div>
                  {/* Button */}
                  <button
                    onClick={p.action}
                    className="w-full mt-3 border border-border rounded-lg py-2 text-xs font-bold text-foreground hover:bg-muted/40 active:scale-[0.98] transition-all"
                  >
                    {p.btnLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
