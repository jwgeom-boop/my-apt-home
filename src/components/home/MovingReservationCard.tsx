import { useNavigate } from "react-router-dom";
import { Truck, QrCode } from "lucide-react";

const MovingReservationCard = () => {
  const navigate = useNavigate();
  const isReserved = localStorage.getItem("moveInReserved") === "true";

  return (
    <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">이사예약 현황</h3>
        </div>
        {isReserved ? (
          <span className="text-xs font-bold bg-success/15 text-success px-2 py-0.5 rounded-full">
            ✅ 예약완료
          </span>
        ) : (
          <span className="text-xs font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            미예약
          </span>
        )}
      </div>
      {isReserved ? (
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-sm text-foreground font-medium">2026.04.20 (일) 09:00</p>
            <p className="text-xs text-muted-foreground">엘리베이터 B동 2호기 배정</p>
          </div>
          <button
            onClick={() => navigate("/qr")}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            <QrCode className="w-3 h-3" />
            QR 보기
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3">
          <p className="text-sm text-muted-foreground">아직 예약하지 않으셨습니다</p>
          <button
            onClick={() => navigate("/reservation")}
            className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          >
            예약하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MovingReservationCard;
