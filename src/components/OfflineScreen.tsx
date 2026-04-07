import { Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

const OfflineScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-4">
      <Radio className="w-16 h-16 text-muted-foreground" />
      <h2 className="text-lg font-bold text-foreground">인터넷 연결을 확인해주세요</h2>
      <p className="text-sm text-muted-foreground">네트워크 연결 후 다시 시도해주세요.</p>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
        다시 시도
      </Button>
    </div>
  );
};

export default OfflineScreen;
