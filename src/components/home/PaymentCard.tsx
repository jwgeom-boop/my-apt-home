import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";

const PaymentCard = () => {
  const navigate = useNavigate();

  const remainingAmount = "120,000,000";
  const dueDate = "2026.04.20";
  const targetDate = new Date("2026-04-20");
  const today = new Date();
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dueDday = diffDays > 0 ? `D-${diffDays}` : diffDays === 0 ? "D-Day" : `D+${Math.abs(diffDays)}`;

  return (
    <div className="bg-card rounded-xl p-4 mb-3 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">잔금납부 현황</h3>
        </div>
        <span className="text-xs font-bold bg-warning/15 text-warning px-2 py-0.5 rounded-full">
          {dueDday}
        </span>
      </div>
      <div className="bg-muted/30 rounded-lg px-4 py-3 mb-3">
        <p className="text-xs text-muted-foreground">미납 잔액</p>
        <p className="text-xl font-bold text-foreground mt-1">{remainingAmount}원</p>
        <p className="text-xs text-muted-foreground mt-1">납부 기한: {dueDate}</p>
      </div>
      <button
        onClick={() => navigate("/payment")}
        className="w-full bg-primary text-primary-foreground text-sm font-bold py-2.5 rounded-lg active:scale-[0.98] transition-transform"
      >
        납부내역 보기
      </button>
    </div>
  );
};

export default PaymentCard;
