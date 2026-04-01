import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

// 오접수 방지 FAQ 데이터 — 가이드 키워드 기반 매칭
const FAQ_DATA: Record<string, { title: string; description: string }> = {
  "벽지 이음선": {
    title: "벽지 이음선은 시공 특성입니다",
    description: "벽지는 폭이 한정되어 있어 이음선이 생기는 것은 정상입니다. 이음선이 1mm 이내이고 벌어지지 않았다면 하자가 아닙니다. 봉투 바름 공법에서는 약간의 들뜸이 일시적으로 나타날 수 있으며, 난방 후 자연스럽게 수축됩니다.",
  },
  "걸레받이": {
    title: "걸레받이 미세 틈은 정상입니다",
    description: "걸레받이와 벽면 사이에 0.5mm 이내의 틈은 시공 공차 범위 내입니다. 코킹 처리가 되어 있다면 정상 시공입니다.",
  },
  "마루 소음": {
    title: "마루 미세 소음은 정상일 수 있습니다",
    description: "강화마루는 온도와 습도에 따라 약간의 팽창·수축이 있어 보행 시 미세한 소음이 발생할 수 있습니다. 입주 후 난방을 가동하면 안정됩니다. 특정 부위에서 반복적으로 큰 소리가 나면 하자입니다.",
  },
  "타일 들뜸": {
    title: "타일 두드림 소리 차이는 정상일 수 있습니다",
    description: "타일을 두드렸을 때 소리가 다른 것은 하부 모르타르 밀착도 차이 때문입니다. 흔들림이 없고 들떠 있지 않다면 정상 범위입니다. 실제로 움직이거나 균열이 있으면 하자입니다.",
  },
  "줄눈": {
    title: "줄눈 색상 차이는 양생 중 나타납니다",
    description: "줄눈 시공 후 완전 건조(약 2~3주)까지 색상이 균일하지 않을 수 있습니다. 건조 후에도 뚜렷한 색상 차이가 있다면 시공 불량입니다.",
  },
  "코킹": {
    title: "코킹 라인 불균일은 재시공 가능합니다",
    description: "코킹(실리콘) 마감이 불균일하거나 일부 누락된 경우 하자로 접수 가능합니다. 다만, 약간의 두께 차이는 시공 특성상 허용 범위입니다.",
  },
  "문틀 간격": {
    title: "방문 하부 틈은 설계 사항입니다",
    description: "방문 하부에 8~12mm 정도의 틈(언더컷)은 실내 환기를 위해 의도적으로 설계된 것입니다. 이는 하자가 아닙니다.",
  },
  "도장": {
    title: "도장 면의 미세 요철은 정상입니다",
    description: "벽면 도장(페인트) 시 롤러 자국으로 인한 미세 요철은 정상 시공 범위입니다. 눈에 띄는 흘러내림, 기포, 색상 차이가 있으면 하자입니다.",
  },
};

interface NormalConstructionFAQProps {
  guideText: string;
}

const NormalConstructionFAQ = ({ guideText }: NormalConstructionFAQProps) => {
  const [showPopup, setShowPopup] = useState(false);

  // 가이드 텍스트에서 FAQ 키워드 매칭
  const matchedFaq = Object.entries(FAQ_DATA).find(([keyword]) =>
    guideText.includes(keyword)
  );

  if (!matchedFaq) return null;

  const [, faq] = matchedFaq;

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setShowPopup(true); }}
        className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-bold ml-1 hover:text-amber-500 transition-colors"
        title="정상 시공 안내"
      >
        <Lightbulb className="w-3 h-3" />
        이건 하자가 아니에요
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPopup(false)} />
          <div className="relative bg-card rounded-2xl border border-border shadow-2xl max-w-sm w-full p-5 animate-fade-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-sm font-bold text-foreground">💡 정상 시공 안내</h4>
            </div>
            <h5 className="text-sm font-semibold text-foreground mb-2">{faq.title}</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">{faq.description}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full mt-4 bg-muted text-foreground rounded-xl py-2.5 text-sm font-bold active:scale-[0.97] transition-transform"
            >
              확인했어요
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NormalConstructionFAQ;
