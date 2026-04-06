import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
}

interface BannerSectionProps {
  steps: Step[];
  readinessPercent: number;
  dday: string;
}

const BannerSection = ({ steps, readinessPercent, dday }: BannerSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-[#0f1923] to-[#2e86c1] rounded-2xl p-4 mx-0 mt-1 mb-3 shadow-lg">
      <p className="text-xs text-white/70 mb-2">101동 1202호 · 입주 예정</p>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-3xl font-black text-white">{dday}</p>
          <p className="text-xs text-white/60 mt-0.5">2026년 4월 26일 입주</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="none" />
              <circle
                cx="32" cy="32" r="27"
                stroke="white" strokeWidth="5" fill="none"
                strokeDasharray={2 * Math.PI * 27}
                strokeDashoffset={2 * Math.PI * 27 * (1 - readinessPercent / 100)}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-white">{readinessPercent}%</span>
              <span className="text-[8px] text-white/60">준비완료</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              {step.status === "completed" ? (
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <Check className="w-2 h-2 text-[#0f1923]" />
                </div>
              ) : step.status === "current" ? (
                <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/20" />
              )}
              <span className="text-[8px] text-white/50 mt-0.5 text-center">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-5 h-px mx-0.5 mb-3",
                step.status === "completed" ? "bg-white/70" : "bg-white/20"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSection;
