import MobileLayout from "@/components/MobileLayout";
import { QrCode, Car, Clock, Copy, Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PURPOSE_OPTIONS = ["이사", "가전·가구 배송", "인테리어 공사", "단순 방문"] as const;

const hours = Array.from({ length: 25 }, (_, i) => i.toString().padStart(2, "0") + ":00");

const QRPage = () => {
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [purpose, setPurpose] = useState<string>("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [vehicleQR, setVehicleQR] = useState(false);

  const handleIssue = () => {
    if (!purpose) {
      toast.error("방문 목적을 선택해주세요");
      return;
    }
    setVehicleQR(true);
    setShowVehicleForm(false);
    toast.success("방문 차량 출입 QR이 발급되었습니다");
  };

  return (
    <MobileLayout title="QR 입장코드">
      {/* 상태 배너 */}
      <div className="bg-success/10 text-success rounded-xl p-3 mb-4 text-center text-sm font-medium">
        ✓ 사전점검 예약 완료 — 입장 가능
      </div>

      {/* QR 코드 카드 */}
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col items-center">
        <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
          <QrCode className="w-32 h-32 text-accent" />
        </div>
        <p className="text-base font-bold text-foreground">101동 1202호 | 홍길동</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">유효기간: 2026.04.01 ~ 04.05</p>
        </div>
      </div>

      {/* 예약 정보 */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">사전점검 예약 정보</h4>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">일자</span>
            <span className="text-foreground font-medium">2026.04.02 (목)</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">시간</span>
            <span className="text-foreground font-medium">11:00 ~ 12:00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">대기번호</span>
            <span className="text-foreground font-medium">7번</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">현재 대기</span>
            <span className="text-primary font-bold">3명</span>
          </div>
        </div>
      </div>

      {/* 차량 QR 발급 결과 */}
      {vehicleQR && (
        <div className="bg-card rounded-xl p-4 border border-primary/30 shadow-sm mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground">방문 차량 출입 QR</h4>
          </div>
          <div className="flex items-center justify-center py-3">
            <div className="w-28 h-28 bg-muted rounded-lg flex items-center justify-center">
              <QrCode className="w-20 h-20 text-primary" />
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">방문 목적</span>
              <span className="text-foreground font-medium">{purpose}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">허용 시간</span>
              <span className="text-foreground font-medium">{startTime} ~ {endTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* 차량 QR 발급 폼 */}
      {showVehicleForm && (
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm mt-4 space-y-4">
          <h4 className="text-sm font-semibold text-foreground">방문 차량 출입 QR 발급</h4>

          {/* 방문 목적 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">방문 목적</label>
            <div className="grid grid-cols-2 gap-2">
              {PURPOSE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPurpose(opt)}
                  className={`text-xs py-2.5 px-3 rounded-lg border transition-colors font-medium ${
                    purpose === opt
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 시간 설정 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">허용 시간 (24시간)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground pr-8"
                >
                  {hours.slice(0, -1).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-muted-foreground text-sm">~</span>
              <div className="relative flex-1">
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground pr-8"
                >
                  {hours.slice(1).map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          <Button onClick={handleIssue} className="w-full h-11 rounded-xl font-semibold">
            QR 발급하기
          </Button>
        </div>
      )}

      {/* 하단 버튼 */}
      {!showVehicleForm && (
        <button
          onClick={() => setShowVehicleForm(true)}
          className="w-full mt-4 bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Car className="w-4 h-4" />
          방문 차량 출입 QR 발급
        </button>
      )}
    </MobileLayout>
  );
};

export default QRPage;
