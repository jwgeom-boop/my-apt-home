import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InteriorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-accent text-accent-foreground h-12 flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold">인테리어 파트너</span>
      </div>
      <div className="flex flex-col items-center justify-center px-4 pt-24">
        <span className="text-4xl mb-4">🛋️</span>
        <p className="text-base font-bold text-foreground mb-1">준비 중입니다</p>
        <p className="text-sm text-muted-foreground">인테리어 파트너 상세 페이지가 곧 오픈됩니다</p>
      </div>
    </div>
  );
};

export default InteriorPage;
