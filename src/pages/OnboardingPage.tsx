import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  { icon: "🏠", title: "입주ON에 오신 걸 환영합니다", desc: "분양부터 입주까지 모든 과정을\n한 앱에서 관리하세요" },
  { icon: "✅", title: "입주 준비를 한눈에", desc: "잔금 납부, 동의서 서명, 사전점검 예약까지\n진행률을 실시간으로 확인하세요" },
  { icon: "🔧", title: "하자는 바로 접수", desc: "방을 선택하고 사진을 찍으면 끝.\n처리 현황도 앱에서 바로 확인하세요" },
  { icon: "🛋️", title: "입주 준비 서비스", desc: "은행 대출, 법무·등기, 인테리어, 이사까지\n협약 파트너사를 한곳에서 만나세요" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);

  const finish = () => {
    localStorage.setItem("onboarding_done", "true");
    navigate("/");
  };

  const next = () => setCurrent((p) => Math.min(p + 1, slides.length - 1));
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  const isLast = current === slides.length - 1;
  const slide = slides[current];

  return (
    <div
      className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <span className="text-7xl">{slide.icon}</span>
        <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">{slide.title}</h2>
        <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">{slide.desc}</p>
      </div>

      {/* Bottom controls */}
      <div className="px-8 pb-12">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === current ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {isLast ? (
          <button
            onClick={finish}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base"
          >
            시작하기
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <button onClick={finish} className="text-sm text-muted-foreground">
              건너뛰기
            </button>
            <button onClick={next} className="text-base font-semibold text-primary">
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
