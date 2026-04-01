import { useState } from "react";
import MobileLayout from "@/components/MobileLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const closedDates = [13, 14, 20, 21];
const availableDates = [10, 11, 15, 16, 17, 22, 23, 24];

const ReservationPage = () => {
  const [selectedDate, setSelectedDate] = useState(15);
  const daysInMonth = 30;
  const firstDayOfWeek = 2; // April 2026 starts on Wednesday (0=Sun)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <MobileLayout title="이사 예약">
      <div className="bg-accent text-accent-foreground rounded-xl p-3 flex items-center justify-between mb-4">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-semibold">2026년 4월</span>
        <ChevronRight className="w-5 h-5" />
      </div>

      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <span key={d} className={d === "일" ? "text-destructive" : d === "토" ? "text-primary" : ""}>
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => (
            <div key={`b-${b}`} />
          ))}
          {days.map((day) => {
            const isClosed = closedDates.includes(day);
            const isAvailable = availableDates.includes(day);
            const isSelected = day === selectedDate;

            return (
              <button
                key={day}
                onClick={() => isAvailable && setSelectedDate(day)}
                className={cn(
                  "w-9 h-9 mx-auto rounded-full text-xs font-medium flex items-center justify-center transition-colors",
                  isSelected && "bg-accent text-accent-foreground",
                  !isSelected && isAvailable && "border border-success text-success",
                  !isSelected && isClosed && "border border-destructive/40 text-destructive/60",
                  !isSelected && !isAvailable && !isClosed && "text-muted-foreground"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground justify-center">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-success" /> 예약가능</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-destructive" /> 마감</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> 선택</span>
        </div>
      </div>

      {selectedDate && (
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
          <p className="text-sm font-bold text-foreground">
            선택: 2026.04.{selectedDate} (수) 오전 이사
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            엘리베이터: 1호기 배정 | 주차구역: A-08
          </p>
        </div>
      )}

      <button className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform">
        이사 예약 확정
      </button>
    </MobileLayout>
  );
};

export default ReservationPage;
