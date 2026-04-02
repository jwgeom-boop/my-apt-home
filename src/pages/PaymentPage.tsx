import MobileLayout from "@/components/MobileLayout";
import { Check, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PaymentItem {
  label: string;
  description?: string;
  amount: number;
  paid: boolean;
  account?: string;
}

const initialItems: PaymentItem[] = [
  { label: "분양 잔금 (30%)", description: "분양가의 30%", amount: 150000000, paid: false, account: "신한 110-382-456789" },
  { label: "중도금 1차 (30%)", description: "대출 상환 또는 잔금대출 전환", amount: 150000000, paid: false, account: "신한 110-382-456789" },
  { label: "중도금 2차 (30%)", description: "대출 상환 또는 잔금대출 전환", amount: 150000000, paid: false, account: "신한 110-382-456789" },
  { label: "중도금 후불 이자", description: "연 4.5% 기준 산정", amount: 18700000, paid: false, account: "신한 110-382-456789" },
  { label: "발코니 확장비", amount: 15000000, paid: false, account: "신한 110-382-456789" },
  { label: "옵션비 (시스템에어컨)", amount: 4200000, paid: true },
  { label: "관리비 예치금", amount: 450000, paid: false, account: "신한 110-382-456789" },
];

const CONTRACT_DEPOSIT = 50000000;

const PaymentPage = () => {
  const [items] = useState<PaymentItem[]>(initialItems);
  const navigate = useNavigate();

  const total = items.reduce((s, i) => s + i.amount, 0);
  const paidTotal = items.filter(i => i.paid).reduce((s, i) => s + i.amount, 0);
  const unpaidTotal = total - paidTotal;
  const allPaid = items.every(i => i.paid);

  const copyAccount = (account: string) => {
    navigator.clipboard.writeText(account);
    toast.success("계좌번호가 복사되었습니다");
  };

  return (
    <MobileLayout title="납부내역">
      {/* 상단 총액 */}
      <div className="bg-accent text-accent-foreground rounded-xl p-4 mb-2 text-center">
        <p className="text-[11px] opacity-80">총 납부 예정액</p>
        <p className="text-xl font-bold mt-0.5">{total.toLocaleString()}원</p>
        <div className="flex justify-center gap-6 mt-2 text-[11px]">
          <div>
            <span className="opacity-70">납부완료</span>
            <p className="font-bold text-xs mt-0.5" style={{ color: "hsl(var(--success))" }}>{paidTotal.toLocaleString()}원</p>
          </div>
          <div>
            <span className="opacity-70">미납잔액</span>
            <p className="font-bold text-xs mt-0.5" style={{ color: "hsl(var(--destructive))" }}>{unpaidTotal.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* 기납부액 안내 */}
      <div className="bg-muted rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
        <AlertCircle className="w-3 h-3 text-muted-foreground shrink-0" />
        <p className="text-[11px] text-muted-foreground">기납부액 (계약금 10%): <span className="font-semibold text-foreground">{CONTRACT_DEPOSIT.toLocaleString()}원</span></p>
      </div>

      {/* 납부 항목 - 컴팩트 리스트 */}
      <div className="space-y-1.5 mb-4">
        {items.map((item, i) => (
          <div
            key={i}
            className={`bg-card rounded-lg px-3 py-2.5 border shadow-sm ${item.paid ? "border-border" : "border-destructive/30"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.paid ? "bg-success" : "bg-destructive"}`} />
                <span className="text-xs font-semibold text-foreground truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-bold text-foreground">{item.amount.toLocaleString()}원</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${item.paid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {item.paid ? "완료" : "미납"}
                </span>
              </div>
            </div>
            {!item.paid && item.account && (
              <div className="flex items-center justify-between mt-1.5 bg-muted rounded px-2 py-1.5">
                <p className="text-[10px] text-muted-foreground">{item.account}</p>
                <button
                  onClick={() => copyAccount(item.account!)}
                  className="text-primary hover:text-primary/80 transition-colors p-0.5"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 입주증 발급 버튼 */}
      <div className="sticky bottom-16 pb-2">
        <Button
          className="w-full h-11 text-sm font-bold rounded-xl"
          disabled={!allPaid}
          onClick={() => navigate("/certificate")}
        >
          {allPaid ? "입주증 발급" : "전체 납부 완료 시 입주증 발급 가능"}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default PaymentPage;
