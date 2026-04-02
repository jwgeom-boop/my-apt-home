import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const banks = [
  {
    name: "KB국민은행",
    emoji: "🏦",
    rate: "연 3.8%~",
    limit: "최대 5억원",
    period: "최장 30년",
    features: ["입주자 우대금리 0.2%p 추가", "중도금→잔금 자동 전환", "비대면 신청 가능"],
    highlight: true,
  },
  {
    name: "신한은행",
    emoji: "🏦",
    rate: "연 3.9%~",
    limit: "최대 4억원",
    period: "최장 30년",
    features: ["입주민 전용 주택담보대출", "금리 우대 쿠폰 제공", "온라인 간편 심사"],
    highlight: false,
  },
  {
    name: "하나은행",
    emoji: "🏦",
    rate: "연 4.0%~",
    limit: "최대 4.5억원",
    period: "최장 35년",
    features: ["중도금 대출 연계 할인", "부부 공동명의 추가 혜택", "전담 상담사 배정"],
    highlight: false,
  },
  {
    name: "우리은행",
    emoji: "🏦",
    rate: "연 4.1%~",
    limit: "최대 3.5억원",
    period: "최장 30년",
    features: ["생애최초 주택구입 우대", "보금자리론 연계 가능", "당일 대출 실행"],
    highlight: false,
  },
];

const LoanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold">잔금대출 비교</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Top info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-xs text-blue-700">
            💡 입주ON 제휴 은행 상품입니다. 금리는 시장 변동에 따라 달라질 수 있습니다.
          </p>
        </div>

        {/* Interest rate summary */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground">현재 최저 금리</p>
          <p className="text-3xl font-black text-primary mt-1">연 3.8%</p>
          <p className="text-xs text-muted-foreground mt-1">2026년 4월 기준 · 신용등급에 따라 상이</p>
        </div>

        {/* Bank cards */}
        {banks.map((bank) => (
          <div
            key={bank.name}
            className={`rounded-xl p-4 border ${
              bank.highlight
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* Top row */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{bank.emoji}</span>
              <span className="text-sm font-bold text-foreground">{bank.name}</span>
              {bank.highlight && (
                <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">
                  추천
                </span>
              )}
            </div>

            {/* Rate */}
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-xl font-black text-primary">{bank.rate}</span>
              <span className="text-xs text-muted-foreground">금리</span>
            </div>

            {/* Info chips */}
            <div className="flex gap-2 mb-3">
              <span className="text-[11px] bg-muted rounded px-2 py-1">{bank.limit}</span>
              <span className="text-[11px] bg-muted rounded px-2 py-1">{bank.period}</span>
            </div>

            {/* Features */}
            <ul className="space-y-1 mb-3">
              {bank.features.map((f, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-success font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() =>
                toast.success(
                  `${bank.name} 상담 신청이 완료되었습니다. 영업일 1일 내 연락드립니다.`
                )
              }
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:scale-[0.98] transition-transform"
            >
              상담 신청
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanPage;
