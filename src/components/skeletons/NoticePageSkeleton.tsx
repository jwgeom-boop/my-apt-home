import { Skeleton } from "@/components/ui/skeleton";

const NoticePageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="w-16 h-8 rounded-full" />
      ))}
    </div>
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="w-full h-[80px] rounded-xl" />
    ))}
  </div>
);

export default NoticePageSkeleton;
