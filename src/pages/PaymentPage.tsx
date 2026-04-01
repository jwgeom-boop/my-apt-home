import MobileLayout from "@/components/MobileLayout";

const paymentItems = [
  { label: "잔금", amount: 2600000, paid: false, account: "신한 110-123-456789" },
  { label: "옵션비 (에어컨)", amount: 850000, paid: true },
  { label: "확장비 (발코니)", amount: 1200000, paid: true },
  { label: "기타부담금", amount: 200000, paid: true },
];

const total = paymentItems.reduce((s, i) => s + i.amount, 0);

const PaymentPage = () => {
  return (
    <MobileLayout title="납부내역">
      <div className="bg-accent text-accent-foreground rounded-xl p-5 mb-4 text-center">
        <p className="text-xs opacity-80">총 납부 예정액</p>
        <p className="text-2xl font-bold mt-1">{total.toLocaleString()} 원</p>
      </div>

      <div className="space-y-3">
        {paymentItems.map((item, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                {item.label}
              </span>
              <span className={`text-xs font-semibold ${item.paid ? "text-success" : "text-destructive"}`}>
                {item.paid ? "납부완료" : "미납"}
              </span>
            </div>
            <p className="text-lg font-bold text-foreground mt-2">{item.amount.toLocaleString()}원</p>
            {item.account && (
              <p className="text-xs text-muted-foreground mt-1">납부계좌: {item.account}</p>
            )}
          </div>
        ))}
      </div>
    </MobileLayout>
  );
};

export default PaymentPage;
