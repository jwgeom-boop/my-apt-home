import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import MobileLayout from "@/components/MobileLayout";
import { ChevronLeft, ChevronRight, ClipboardList, Truck, Check, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const INSPECTION_AVAILABLE = [1, 2, 3, 4, 5];
const INSPECTION_CLOSED = [6, 7, 12, 13, 14, 20, 21];
const MOVE_AVAILABLE = [10, 11, 15, 16, 17, 22, 23, 24];
const MOVE_CLOSED = [13, 14, 20, 21];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];

const ReservationPage = () => {
  const [activeTab, setActiveTab] = useState<"inspection" | "move">("inspection");

  // 사전점검
  const [inspectionDate, setInspectionDate] = useState<number | null>(null);
  const [inspectionTime, setInspectionTime] = useState<string | null>(null);
  const [inspectionConfirmed, setInspectionConfirmed] = useState(false);

  // 이사
  const [moveInDate, setMoveInDate] = useState<number | null>(null);
  const [moveInTime, setMoveInTime] = useState<string | null>(null);
  const [moveInConfirmed, setMoveInConfirmed] = useState(false);

  const inspectionQrRef = useRef<HTMLCanvasElement>(null);
  const moveInQrRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (inspectionConfirmed && inspectionQrRef.current) {
      QRCode.toCanvas(inspectionQrRef.current,
        `INSPECTION-101-1202-${inspectionDate}-${inspectionTime}`,
        { width: 120, margin: 1 }
      );
    }
  }, [inspectionConfirmed]);

  useEffect(() => {
    if (moveInConfirmed && moveInQrRef.current) {
      QRCode.toCanvas(moveInQrRef.current,
        `MOVEIN-101-1202-${moveInDate}-${moveInTime}`,
        { width: 120, margin: 1 }
      );
    }
  }, [moveInConfirmed]);

  const daysInMonth = 30;
  const firstDayOfWeek = 2;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const availableDates = activeTab === "inspection" ? INSPECTION_AVAILABLE : MOVE_AVAILABLE;
  const closedDates = activeTab === "inspection" ? INSPECTION_CLOSED : MOVE_CLOSED;

  const renderCalendar = (
    selectedDate: number | null,
    onSelect: (d: number) => void
  ) => (
    <>
      <div className="bg-accent text-accent-foreground rounded-xl p-3 flex items-center justify-between mb-4">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm font-semibold">2026년 4월</span>
        <ChevronRight className="w-5 h-5" />
      </div>
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-4">
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <span key={d} className={d === "일" ? "text-destructive" : d === "토" ? "text-primary" : ""}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => <div key={`b-${b}`} />)}
          {days.map((day) => {
            const isClosed = closedDates.includes(day);
            const isAvailable = availableDates.includes(day);
            const isSelected = day === selectedDate;
            return (
              <button
                key={day}
                onClick={() => isAvailable && onSelect(day)}
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
    </>
  );

  const handleInspectionConfirm = () => {
    if (!inspectionDate || !inspectionTime) return;
    toast.success(`사전점검 예약 완료: 4월 ${inspectionDate}일 ${inspectionTime}`);
    setInspectionConfirmed(true);
  };

  const handleMoveConfirm = () => {
    if (!moveInDate || !moveInTime) return;
    toast.success(`이사 예약 완료: 4월 ${moveInDate}일 ${moveInTime}`);
    setMoveInConfirmed(true);
    localStorage.setItem("moveInReserved", "true");
  };

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
            <p className="text-xs text-muted-foreground mt-0.5">운영 기간: 2026.04.01 ~ 04.05 (09:00 ~ 17:00)</p>
          </div>

          {inspectionConfirmed ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm font-bold text-success">사전점검 예약 완료</p>
              </div>
              <p className="text-sm text-foreground">2026.04.{String(inspectionDate).padStart(2, "0")} {inspectionTime}</p>
              <div className="flex flex-col items-center mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">사전점검 입장 QR</p>
                <canvas ref={inspectionQrRef} className="rounded-lg" />
              </div>
              <button
                onClick={() => {
                  setInspectionConfirmed(false);
                  setInspectionDate(null);
                  setInspectionTime(null);
                }}
                className="mt-3 text-xs text-primary font-semibold underline"
              >
                변경
              </button>
            </div>
          ) : (
            <>
              {renderCalendar(inspectionDate, (d) => {
                setInspectionDate(d);
                setInspectionTime(null);
              })}

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
            <p className="text-xs text-muted-foreground mt-0.5">주말·공휴일 제외 / 동당 1일 4세대 제한</p>
          </div>

          {moveInConfirmed ? (
            <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <p className="text-sm font-bold text-success">이사 예약 완료</p>
              </div>
              <p className="text-sm text-foreground">2026.04.{String(moveInDate).padStart(2, "0")} {moveInTime}</p>
              <p className="text-xs text-muted-foreground mt-1">엘리베이터: 1호기 배정 / 주차구역: A-08</p>
              <div className="flex flex-col items-center mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">이사 차량 출입 QR</p>
                <canvas ref={moveInQrRef} className="rounded-lg" />
              </div>
              <button
                onClick={() => {
                  setMoveInConfirmed(false);
                  setMoveInDate(null);
                  setMoveInTime(null);
                }}
                className="mt-3 text-xs text-primary font-semibold underline"
              >
                변경
              </button>
            </div>
          ) : (
            <>
              {renderCalendar(moveInDate, (d) => {
                setMoveInDate(d);
                setMoveInTime(null);
              })}

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
    </MobileLayout>
  );
};

export default ReservationPage;
