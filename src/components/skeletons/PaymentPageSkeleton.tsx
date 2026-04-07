const PaymentPageSkeleton = () => (
  <div className="space-y-2">
    <div className="skeleton-shimmer w-full h-[90px]" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="skeleton-shimmer w-full h-[70px]" />
    ))}
  </div>
);

export default PaymentPageSkeleton;
