import { Skeleton } from "@/components/ui/skeleton";

const HomePageSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="w-full h-[120px] rounded-2xl" />
    <Skeleton className="w-full h-[60px] rounded-xl" />
    <Skeleton className="w-full h-[60px] rounded-xl" />
  </div>
);

export default HomePageSkeleton;
