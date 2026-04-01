import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CertificatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-6">입주증</h1>
      </header>

      <div className="flex-1 px-4 pt-6 pb-6 flex flex-col gap-5">
        {/* Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <span className="text-green-600 text-2xl">🎉</span>
          <h2 className="text-base font-bold text-green-700 mt-1">입주증이 발급되었습니다</h2>
          <p className="text-xs text-green-600 mt-1">아래 입주증을 저장하여 입주 시 제시해 주세요</p>
        </div>

        {/* Certificate Card */}
        <div className="bg-card border-2 border-primary rounded-2xl overflow-hidden shadow-lg">
          {/* Card Header */}
          <div className="bg-navy text-white p-5 text-center">
            <p className="text-xs text-white/70 mb-1">○○아파트</p>
            <h2 className="text-xl font-bold">입 주 증</h2>
            <p className="text-xs text-white/60 mt-1">RESIDENT CERTIFICATE</p>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-4">
            {/* QR */}
            <div className="flex justify-center">
              <div className="w-32 h-32 bg-muted rounded-xl flex items-center justify-center border border-border">
                <div className="w-24 h-24 bg-foreground/10 rounded-lg grid grid-cols-5 grid-rows-5 gap-0.5 p-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${[0,1,2,4,5,6,10,12,14,18,19,20,22,23,24].includes(i) ? 'bg-foreground' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">세대번호</span>
                <span className="font-semibold text-foreground">101동 0102호</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">입주자명</span>
                <span className="font-semibold text-foreground">홍길동</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">입주예정일</span>
                <span className="font-semibold text-foreground">2026.04.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">발급일</span>
                <span className="font-semibold text-foreground">2026.04.01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full h-14 rounded-xl bg-navy hover:bg-navy/90 text-white text-base font-bold flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          PDF 저장하기
        </Button>
      </div>
    </div>
  );
};

export default CertificatePage;
