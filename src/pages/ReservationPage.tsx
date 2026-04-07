import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import MobileLayout from "@/components/MobileLayout";
import { ChevronLeft, ChevronRight, ClipboardList, Truck, Check, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useStage } from "@/hooks/useStage";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// 오늘: 2026-04-07
const TODAY = new Date(2026, 3, 7);

// 사전점검: 2026-04-25 ~ 04-27
const INSPECTION_AVAILABLE_DATES = [
  new Date(2026, 3, 25),
  new Date(2026, 3, 26),
  new Date(2026, 3, 27),
];

// 이사: 2026-05-15 ~ 2026-07-15 평일
const MOVE_START = new Date(2026, 4, 15);
const MOVE_END = new Date(2026, 6, 15);

const isWeekday = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6;
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const formatDateStr = (d: Date) =>
  `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

interface CalendarProps {
  year: number;
  month: number; // 0-indexed
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  isDateAvailable: (d: Date) => boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

const CalendarView = ({
  year, month, selectedDate, onSelect,
  isDateAvailable, onPrevMonth, onNextMonth,
  canGoPrev = false, canGoNext = false,
}: CalendarProps) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay(); // 0=Sun
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const blanks = Array.from({ length: firstDow }, (_, i) => i);

  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <>
      <div className="bg-accent text-accent-foreground rounded-xl p-3 flex items-center justify-between mb-4">
        <button onClick={onPrevMonth} disabled={!canGoPrev} className={cn("p-0.5", !canGoPrev && "opacity-30 cursor-not-allowed")}>
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button onClick={onNextMonth} disabled={!canGoNext} className={cn("p-0.5", !canGoNext && "opacity-30 cursor-not-allowed")}>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
          {DAY_LABELS.map((d) => (
            <span key={d} className={d === "일" ? "text-destructive" : d === "토" ? "text-primary" : ""}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => <div key={`b-${b}`} />)}
          {days.map((day) => {
            const dow = day.getDay();
            const available = isDateAvailable(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = day < TODAY && !isSameDay(day, TODAY);
            const isToday = isSameDay(day, TODAY);
            const isSun = dow === 0;
            const isSat = dow === 6;
            const isDisabled = !available || isPast;

            let bgClass = "bg-background";
            let textClass = "text-foreground";

            if (isSelected) {
              bgClass = "bg-navy";
              textClass = "text-white";
            } else if (!available) {
              bgClass = "bg-muted";
              textClass = "text-muted-foreground/40";
            } else if (isSun) {
              textClass = "text-destructive";
            } else if (isSat) {
              textClass = "text-primary";
            }

            return (
              <button
                key={day.getDate()}
                disabled={isDisabled}
                onClick={() => !isDisabled && onSelect(day)}
                className={cn(
                  "w-9 h-9 mx-auto rounded-full text-xs font-medium flex flex-col items-center justify-center transition-colors relative",
                  bgClass, textClass,
                  isDisabled && "cursor-not-allowed opacity-60",
                  !isDisabled && !isSelected && "hover:bg-muted/60"
                )}
              >
                {day.getDate()}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground justify-center flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-background border border-border" /> 선택가능</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-navy" /> 선택됨</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-muted" /> 불가</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> 오늘</span>
        </div>
      </div>
    </>
  );
};

const ReservationPage = () => {
  const navigate = useNavigate();
  const { updateFlag } = useStage();
  const [activeTab, setActiveTab] = useState<"inspection" | "move">("inspection");

  // Restore from localStorage
  const savedInspection = (() => {
    try { const r = localStorage.getItem("inspectionReservation"); return r ? JSON.parse(r) : null; } catch { return null; }
  })();
  const savedMoving = (() => {
    try { const r = localStorage.getItem("movingReservation"); return r ? JSON.parse(r) : null; } catch { return null; }
  })();

  // 사전점검
  const [inspectionDate, setInspectionDate] = useState<Date | null>(() => {
    if (savedInspection?.date) { const [y, m, d] = savedInspection.date.split(".").map(Number); return new Date(y, m - 1, d); }
    return null;
  });
  const [inspectionTime, setInspectionTime] = useState<string | null>(savedInspection?.time ?? null);
  const [inspectionConfirmed, setInspectionConfirmed] = useState(savedInspection?.status === "confirmed");

  // 이사
  const [moveInDate, setMoveInDate] = useState<Date | null>(() => {
    if (savedMoving?.date) { const [y, m, d] = savedMoving.date.split(".").map(Number); return new Date(y, m - 1, d); }
    return null;
  });
  const [moveInTime, setMoveInTime] = useState<string | null>(savedMoving?.time ?? null);
  const [moveInConfirmed, setMoveInConfirmed] = useState(savedMoving?.status === "confirmed");
  const [moveCalMonth, setMoveCalMonth] = useState<{ year: number; month: number }>({ year: 2026, month: 4 }); // May

  const [cancelTarget, setCancelTarget] = useState<"inspection" | "move" | null>(null);

  const inspectionQrRef = useRef<HTMLCanvasElement>(null);
  const moveInQrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (inspectionConfirmed && inspectionQrRef.current && inspectionDate) {
      QRCode.toCanvas(inspectionQrRef.current,
        `INSPECTION-101-1202-${formatDateStr(inspectionDate)}-${inspectionTime}`,
        { width: 120, margin: 1 }
      );
    }
  }, [inspectionConfirmed]);

  useEffect(() => {
    if (moveInConfirmed && moveInQrRef.current && moveInDate) {
      QRCode.toCanvas(moveInQrRef.current,
        `MOVEIN-101-1202-${formatDateStr(moveInDate)}-${moveInTime}`,
        { width: 120, margin: 1 }
      );
    }
  }, [moveInConfirmed]);

  const isInspectionDateAvailable = (d: Date) =>
    INSPECTION_AVAILABLE_DATES.some((ad) => isSameDay(ad, d));

  const isMoveDateAvailable = (d: Date) =>
    d >= MOVE_START && d <= MOVE_END && isWeekday(d);

  const handleInspectionConfirm = () => {
    if (!inspectionDate || !inspectionTime) return;
    toast.success("✅ 사전점검 예약이 완료되었습니다.");
    setInspectionConfirmed(true);
    localStorage.setItem("inspectionReservation", JSON.stringify({
      date: formatDateStr(inspectionDate),
      time: inspectionTime,
      waitingNumber: 3,
      status: "confirmed",
    }));
    updateFlag("isInspectionDone", true);
    setTimeout(() => navigate("/"), 2000);
  };

  const handleMoveConfirm = () => {
    if (!moveInDate || !moveInTime) return;
    toast.success("✅ 이사 예약이 완료되었습니다.");
    setMoveInConfirmed(true);
    localStorage.setItem("movingReservation", JSON.stringify({
      date: formatDateStr(moveInDate),
      time: moveInTime,
      elevator: "1호기",
      parking: "A-08",
      status: "confirmed",
    }));
    localStorage.setItem("moveInReserved", "true");
    updateFlag("isMovingReserved", true);
    setTimeout(() => navigate("/"), 2000);
  };

  const handleCancel = () => {
    if (cancelTarget === "inspection") {
      setInspectionConfirmed(false);
      setInspectionDate(null);
      setInspectionTime(null);
      localStorage.removeItem("inspectionReservation");
      updateFlag("isInspectionDone", false);
    } else if (cancelTarget === "move") {
      setMoveInConfirmed(false);
      setMoveInDate(null);
      setMoveInTime(null);
      localStorage.removeItem("movingReservation");
      localStorage.removeItem("moveInReserved");
      updateFlag("isMovingReserved", false);
    }
    setCancelTarget(null);
    toast.success("예약이 취소되었습니다.");
  };

  // Move calendar navigation (May 2026 ~ Jul 2026)
  const moveCanGoPrev = moveCalMonth.year > 2026 || moveCalMonth.month > 4;
  const moveCanGoNext = moveCalMonth.year < 2026 || moveCalMonth.month < 6;

  return (
    <MobileLayout title="예약">
      {/* Tab Switcher */}
      <div className="bg-muted rounded-xl p-1 flex mb-4">
        <button
          onClick={() => setActiveTab("inspection")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-all",
            activeTab === "inspection"
              ? "bg-card shadow-sm text-primary"
              : "text-muted-foreground"
          )}
        >
          <ClipboardList className="w-4 h-4" />
          사전점검 예약
          {inspectionConfirmed && <Check className="w-3.5 h-3.5 text-success" />}
        </button>
        <button
          onClick={() => setActiveTab("move")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition-all",
            activeTab === "move"
              ? "bg-card shadow-sm text-primary"
              : "text-muted-foreground"
          )}
        >
          <Truck className="w-4 h-4" />
          이사 예약
          {moveInConfirmed && <Check className="w-3.5 h-3.5 text-success" />}
        </button>
      </div>

      {/* 사전점검 예약 */}
      {activeTab === "inspection" && (
        <>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-bold text-primary">사전점검 안내</p>
            <p className="text-xs text-muted-foreground mt-0.5">운영 기간: 2026.04.25 ~ 04.27 (09:00 ~ 17:00)</p>
          </div>

          {inspectionConfirmed ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm font-bold text-success">사전점검 예약 완료</p>
              </div>
              <p className="text-sm text-foreground">{formatDateStr(inspectionDate!)} {inspectionTime}</p>
              <div className="flex flex-col items-center mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">사전점검 입장 QR</p>
                <canvas ref={inspectionQrRef} className="rounded-lg" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectionConfirmed(false);
                    setInspectionDate(null);
                    setInspectionTime(null);
                  }}
                  className="flex-1 text-xs font-semibold border border-border text-foreground rounded-lg px-3 py-2"
                >
                  예약 변경
                </button>
                <button
                  onClick={() => setCancelTarget("inspection")}
                  className="flex-1 text-xs font-semibold border border-destructive text-destructive rounded-lg px-3 py-2"
                >
                  예약 취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <CalendarView
                year={2026}
                month={3}
                selectedDate={inspectionDate}
                onSelect={(d) => { setInspectionDate(d); setInspectionTime(null); }}
                isDateAvailable={isInspectionDateAvailable}
              />

              {inspectionDate && (
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4 animate-fade-in">
                  <p className="text-xs font-bold text-muted-foreground mb-2">시간 선택</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setInspectionTime(t)}
                        className={cn(
                          "py-2 rounded-lg text-xs font-medium border transition-colors",
                          inspectionTime === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-muted/40"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleInspectionConfirm}
                disabled={!inspectionDate || !inspectionTime}
                className={cn(
                  "w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform",
                  (!inspectionDate || !inspectionTime) && "opacity-40 pointer-events-none"
                )}
              >
                사전점검 예약 확정
              </button>
            </>
          )}
        </>
      )}

      {/* 이사 예약 */}
      {activeTab === "move" && (
        <>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-bold text-primary">이사 예약 안내</p>
            <p className="text-xs text-muted-foreground mt-0.5">운영 기간: 2026.05.15 ~ 07.15 / 주말·공휴일 제외 / 동당 1일 4세대 제한</p>
          </div>

          {moveInConfirmed ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm font-bold text-success">이사 예약 완료</p>
              </div>
              <p className="text-sm text-foreground">{formatDateStr(moveInDate!)} {moveInTime}</p>
              <p className="text-xs text-muted-foreground mt-1">엘리베이터: 1호기 배정 / 주차구역: A-08</p>
              <div className="flex flex-col items-center mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">이사 차량 출입 QR</p>
                <canvas ref={moveInQrRef} className="rounded-lg" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    setMoveInConfirmed(false);
                    setMoveInDate(null);
                    setMoveInTime(null);
                  }}
                  className="flex-1 text-xs font-semibold border border-border text-foreground rounded-lg px-3 py-2"
                >
                  예약 변경
                </button>
                <button
                  onClick={() => setCancelTarget("move")}
                  className="flex-1 text-xs font-semibold border border-destructive text-destructive rounded-lg px-3 py-2"
                >
                  예약 취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <CalendarView
                year={moveCalMonth.year}
                month={moveCalMonth.month}
                selectedDate={moveInDate}
                onSelect={(d) => { setMoveInDate(d); setMoveInTime(null); }}
                isDateAvailable={isMoveDateAvailable}
                canGoPrev={moveCanGoPrev}
                canGoNext={moveCanGoNext}
                onPrevMonth={() => {
                  setMoveCalMonth((prev) => {
                    const m = prev.month - 1;
                    return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
                  });
                }}
                onNextMonth={() => {
                  setMoveCalMonth((prev) => {
                    const m = prev.month + 1;
                    return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
                  });
                }}
              />

              {moveInDate && (
                <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4 animate-fade-in">
                  <p className="text-xs font-bold text-muted-foreground mb-2">시간 선택</p>
                  <div className="flex gap-2">
                    {["오전 (09:00~12:00)", "오후 (13:00~17:00)"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setMoveInTime(t)}
                        className={cn(
                          "flex-1 py-3 rounded-xl text-xs font-semibold border transition-colors",
                          moveInTime === t
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background border-border text-foreground hover:bg-muted/40"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {moveInTime && (
                    <div className="mt-3 bg-muted/30 rounded-lg px-3 py-2 text-xs text-muted-foreground animate-fade-in">
                      엘리베이터: 1호기 배정 / 주차구역: A-08
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleMoveConfirm}
                disabled={!moveInDate || !moveInTime}
                className={cn(
                  "w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform",
                  (!moveInDate || !moveInTime) && "opacity-40 pointer-events-none"
                )}
              >
                이사 예약 확정
              </button>
            </>
          )}
        </>
      )}

      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent className="rounded-xl max-w-[320px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {cancelTarget === "inspection"
                ? "사전점검 예약을 취소하시겠습니까?"
                : "이사 예약을 취소하시겠습니까?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {cancelTarget === "inspection"
                ? "취소 후 재예약이 가능합니다.\n단, 마감된 날짜는 선택할 수 없습니다."
                : "취소 후 재예약이 가능합니다.\n동당 예약 인원이 제한되어 있어\n원하는 날짜를 선택하지 못할 수 있습니다."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 mt-0">돌아가기</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              예약 취소
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MobileLayout>
  );
};

export default ReservationPage;
