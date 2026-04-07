const DefectPageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-1.5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-shimmer w-16 h-8 rounded-lg" />
      ))}
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="skeleton-shimmer w-full h-[90px]" />
    ))}
  </div>
);

export default DefectPageSkeleton;
