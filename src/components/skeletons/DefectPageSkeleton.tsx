import { Skeleton } from "@/components/ui/skeleton";

const DefectPageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-1.5">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="w-16 h-8 rounded-full" />
      ))}
    </div>
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="w-full h-[90px] rounded-xl" />
    ))}
  </div>
);

export default DefectPageSkeleton;
