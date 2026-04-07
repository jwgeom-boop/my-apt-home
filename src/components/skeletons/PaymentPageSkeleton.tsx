import { Skeleton } from "@/components/ui/skeleton";

const PaymentPageSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="w-full h-[90px] rounded-2xl" />
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="w-full h-[70px] rounded-xl" />
    ))}
  </div>
);

export default PaymentPageSkeleton;
