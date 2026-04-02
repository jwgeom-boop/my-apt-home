import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import BottomTabBar from "@/components/BottomTabBar";

const categories = ["전체", "잔금·대출", "등기·법무", "입주절차", "하자·AS", "기타"] as const;

type Category = (typeof categories)[number];

interface FaqItem {
  category: Exclude<Category, "전체">;
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  { category: "잔금·대출", question: "잔금은 언제까지 납부해야 하나요?", answer: "입주지정일 기준으로 입주 전날까지 납부하셔야 합니다. 납부 기한을 초과할 경우 연체이자가 발생할 수 있으니 반드시 기한 내 납부해 주세요." },
  { category: "잔금·대출", question: "중도금 대출을 잔금 대출로 전환하려면 어떻게 하나요?", answer: "기존 중도금 대출 은행에 잔금대출 전환 신청을 하시면 됩니다. 앱 내 [서비스 → 은행·대출] 메뉴에서 협약 은행에 바로 상담 신청하실 수 있습니다." },
  { category: "잔금·대출", question: "잔금 대출 한도는 얼마인가요?", answer: "LTV(담보인정비율) 기준으로 최대 분양가의 70%까지 가능하며, 개인 신용도에 따라 달라질 수 있습니다. 정확한 한도는 은행 상담을 통해 확인하세요." },
  { category: "등기·법무", question: "소유권이전등기는 언제 신청하나요?", answer: "잔금 납부 완료 후 60일 이내에 신청하셔야 합니다. 기한 초과 시 과태료가 부과됩니다." },
  { category: "등기·법무", question: "등기 비용은 얼마나 드나요?", answer: "취득세, 법무사 수수료, 등록면허세 등을 합산하면 통상 분양가의 1~3% 수준입니다. 앱 내 [서비스 → 법무·등기] 메뉴에서 정확한 견적을 받아보세요." },
  { category: "등기·법무", question: "등기를 직접 하지 않아도 되나요?", answer: "법무사에 위임하면 대리 처리가 가능합니다. 앱 내 협약 법무사를 통해 비대면으로 완결할 수 있습니다." },
  { category: "입주절차", question: "사전점검은 꼭 가야 하나요?", answer: "의무사항은 아니지만, 하자를 미리 확인하고 입주 전 보수를 받을 수 있어 반드시 참석을 권장합니다." },
  { category: "입주절차", question: "입주증은 어디서 받나요?", answer: "앱 하단 [마이 → 입주증] 메뉴에서 디지털 입주증을 확인하고 PDF로 저장할 수 있습니다." },
  { category: "입주절차", question: "이사 예약은 어떻게 하나요?", answer: "앱 하단 [예약] 탭에서 이사 날짜와 시간대를 선택해 예약하실 수 있습니다." },
  { category: "하자·AS", question: "하자 접수 후 처리 기간은 얼마나 걸리나요?", answer: "일반 하자는 접수 후 영업일 기준 5~7일 내 처리됩니다. 긴급 하자(누수, 전기 등)는 24시간 내 출동합니다." },
  { category: "하자·AS", question: "하자 접수는 몇 건까지 가능한가요?", answer: "건수 제한 없이 접수 가능합니다. 방별로 구분하여 접수하면 처리가 더 빠릅니다." },
  { category: "하자·AS", question: "입주 후에도 하자 접수가 되나요?", answer: "공동주택 하자담보책임 기간(최대 10년) 내에는 접수 가능합니다. 부위별로 담보기간이 다르니 입주지원센터에 문의하세요." },
  { category: "기타", question: "앱 로그인이 안 돼요.", answer: "세대주 휴대폰 번호로 등록된 번호를 확인해 주세요. 문제가 지속되면 입주지원센터(앱 내 [마이 → 비상연락처])로 연락 주세요." },
  { category: "기타", question: "개인정보 변경은 어떻게 하나요?", answer: "[마이 → 개인정보 수정] 메뉴에서 직접 수정하실 수 있습니다." },
];

const FaqPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = selectedCategory === "전체"
    ? faqItems
    : faqItems.filter((item) => item.category === selectedCategory);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-accent text-accent-foreground flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold">자주 묻는 질문</h1>
      </header>

      <div className="px-4 pt-4 pb-24 flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">자주 묻는 질문</h2>
          <p className="text-sm text-muted-foreground">궁금한 점을 빠르게 찾아보세요</p>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setOpenIndex(null); }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm divide-y divide-border">
          {filtered.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={`${item.category}-${i}`}>
                <button
                  onClick={() => handleToggle(i)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-primary mt-0.5">Q.</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3">
                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default FaqPage;
