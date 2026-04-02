import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";

const steps = [
  { num: 1, title: "서류 접수", desc: "신분증, 계약서 사본 제출 (앱 또는 방문)" },
  { num: 2, title: "서류 검토", desc: "담당 법무사 배정 및 서류 검토 (1영업일)" },
  { num: 3, title: "등기 신청", desc: "법원 등기소 온라인 신청 대행" },
  { num: 4, title: "완료 통보", desc: "등기완료증 발급 및 알림 발송" },
];

const costs = [
  { label: "법무사 수수료", value: "별도 협의" },
  { label: "취득세", value: "시가표준액의 1~3%" },
  { label: "등록면허세", value: "채권금액의 0.2%" },
  { label: "국민주택채권", value: "매입 후 즉시 할인 매도 가능" },
];

const RegistryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold">스마트등기</h1>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 text-center">
          <span className="text-3xl">⚖️</span>
          <p className="text-lg font-black text-foreground mt-2">소유권이전 등기 대행</p>
          <p className="text-xs text-muted-foreground mt-2">
            아파트 입주 시 필수 절차를 전문가가 대신 처리해드립니다
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground">서비스 수수료</span>
            <span className="text-primary font-bold text-sm">건당 협의</span>
          </div>
        </div>

        {/* 왜 필요한가 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">등기, 직접 하기 어려운 이유</p>
          <ul className="space-y-2">
            {[
              "복잡한 서류 준비 — 취득세 신고, 등록세 납부 등 10종 이상",
              "기한 내 미신청 시 과태료 발생",
              "금융기관 대출 실행과 동시 진행 필요",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="shrink-0">❌</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* 진행 절차 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">진행 절차</p>
          <div>
            {steps.map((s, i) => (
              <div key={s.num}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                    {s.num}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-bold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-6 bg-border ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 비용 안내 */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">비용 안내</p>
          {costs.map((c, i) => (
            <div
              key={i}
              className={`flex justify-between text-sm py-2 ${
                i < costs.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium text-foreground">{c.value}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground mt-3">
            ※ 정확한 비용은 상담 후 안내드립니다
          </p>
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background/95 backdrop-blur-sm border-t border-border px-4 py-3 flex gap-2">
        <button
          onClick={() => { window.location.href = "tel:1588-0000"; }}
          className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Phone className="w-4 h-4" />
          전화 상담
        </button>
        <button
          onClick={() =>
            toast.success("신청이 접수되었습니다. 담당자가 1영업일 내 연락드립니다.")
          }
          className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold active:scale-[0.98] transition-transform"
        >
          온라인 신청
        </button>
      </div>
    </div>
  );
};

export default RegistryPage;
