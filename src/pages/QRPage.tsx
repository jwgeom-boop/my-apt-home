import MobileLayout from "@/components/MobileLayout";
import { QrCode } from "lucide-react";

const QRPage = () => {
  return (
    <MobileLayout title="QR 입장코드">
      <div className="bg-success/10 text-success rounded-xl p-3 mb-4 text-center text-sm font-medium">
        ✓ 사전점검 예약 완료 — 입장 가능
      </div>

      <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col items-center">
        <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
          <QrCode className="w-32 h-32 text-accent" />
        </div>
        <p className="text-base font-bold text-foreground">101동 1202호 | 홍길동</p>
        <p className="text-xs text-muted-foreground mt-1">유효기간: 2026.04.01 ~ 04.05</p>
      </div>

      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mt-4">
        <h4 className="text-sm font-semibold text-foreground mb-2">사전점검 예약 정보</h4>
        <p className="text-xs text-muted-foreground">일자: 2026.04.02 (목) | 시간: 11:00 ~ 12:00</p>
        <p className="text-xs text-muted-foreground">대기번호: 7번 | 현재 대기: 3명</p>
      </div>

      <button className="w-full mt-4 bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm active:scale-[0.98] transition-transform">
        이삿짐 차량 QR 발급
      </button>
    </MobileLayout>
  );
};

export default QRPage;
