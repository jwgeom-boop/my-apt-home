import { useRef, useState } from "react";
import { ArrowLeft, Download, Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const infoRows = [
  { label: "단 지 명", value: "oo아파트 101현장" },
  { label: "세 대 번 호", value: "101동 0102호" },
  { label: "전 용 면 적", value: "59㎡" },
  { label: "입 주 자", value: "홍길동" },
  { label: "발 급 일", value: "2026.04.01" },
  { label: "유 효 기 간", value: "2026.12.31" },
];

const CertificatePage = () => {
  const navigate = useNavigate();
  const certRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const handleSavePDF = async () => {
    if (!certRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save("입주증.pdf");
    } finally {
      setSaving(false);
    }
  };

  const handleCapture = async () => {
    if (!certRef.current) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = "입주증.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className="mx-auto max-w-[390px] min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy text-white flex items-center h-12 px-4">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-semibold pr-6">입주증</h1>
      </header>

      <div className="flex-1 px-4 pt-4 pb-6 flex flex-col gap-4">
        {/* Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-green-600 font-bold">✔</span>
          <span className="text-sm font-semibold text-green-700">입주증 발급 완료</span>
        </div>

        {/* Certificate Card - formal document style */}
        <div ref={certRef} className="bg-card border-2 border-navy rounded-xl overflow-hidden shadow-lg">
          {/* Title */}
          <div className="bg-navy text-white py-4 text-center">
            <h2 className="text-xl font-bold tracking-[0.3em]">입 주 증</h2>
          </div>

          {/* Info Table */}
          <div className="p-5">
            <div className="divide-y divide-border">
              {infoRows.map((row, i) => (
                <div key={i} className="flex py-3 text-sm">
                  <span className="w-24 text-muted-foreground shrink-0">{row.label}</span>
                  <span className="font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            {/* QR + Stamp area */}
            <div className="mt-4 flex items-end justify-between">
              <p className="text-[10px] text-muted-foreground">시행사</p>
              <div className="flex items-center gap-3">
                {/* Stamp placeholder */}
                <div className="w-12 h-12 rounded-full border-2 border-destructive/40 flex items-center justify-center">
                  <span className="text-[8px] text-destructive/60">직인</span>
                </div>
                {/* QR placeholder */}
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border border-border">
                  <div className="w-12 h-12 bg-foreground/10 rounded grid grid-cols-4 grid-rows-4 gap-0.5 p-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${[0,1,3,4,6,9,11,12,13,15].includes(i) ? 'bg-foreground' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl border-border text-foreground font-medium flex items-center justify-center gap-2"
            onClick={handleSavePDF}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {saving ? "저장 중..." : "PDF로 저장"}
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2"
            onClick={handleCapture}
            disabled={capturing}
          >
            {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            {capturing ? "저장 중..." : "화면 캡처"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
