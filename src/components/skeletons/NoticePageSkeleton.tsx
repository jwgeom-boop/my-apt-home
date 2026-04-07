const NoticePageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skeleton-shimmer w-16 h-8 rounded-full" />
      ))}
    </div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="skeleton-shimmer w-full h-[80px]" />
    ))}
  </div>
);

export default NoticePageSkeleton;
