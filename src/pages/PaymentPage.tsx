import MobileLayout from "@/components/MobileLayout";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { X, Loader2, Paperclip, FileText } from "lucide-react";

interface PaymentRequest {
  id: string;
  date: string;
  types: string[];
  fileNames: string[];
  memo?: string;
  status: "검토중" | "승인완료";
}

type PaymentStatus = "미신청" | "검토중" | "승인완료";

const PAYMENT_TYPES = ["잔금", "중도금", "옵션비", "발코니 확장비", "기타"];

const PaymentPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    (localStorage.getItem("ipjuon_payment_status") as PaymentStatus) || "미신청"
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [memo, setMemo] = useState("");
  const [sending, setSending] = useState(false);
  const [requests, setRequests] = useState<PaymentRequest[]>(
    JSON.parse(localStorage.getItem("ipjuon_payment_requests") || "[]")
  );

  const isValid = selectedTypes.length > 0 && files.length > 0;

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const total = files.length + selected.length;
    if (total > 5) {
      toast.error("파일은 최대 5개까지 첨부 가능합니다");
      return;
    }
    for (const f of selected) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error("파일 크기는 10MB 이하만 가능합니다");
        return;
      }
    }
    setFiles(prev => [...prev, ...selected]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!isValid || sending) return;
    setSending(true);

    await new Promise(r => setTimeout(r, 1500));

    const request: PaymentRequest = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("ko-KR"),
      types: selectedTypes,
      fileNames: files.map(f => f.name),
      memo: memo || undefined,
      status: "검토중",
    };

    const existing = JSON.parse(localStorage.getItem("ipjuon_payment_requests") || "[]");
    localStorage.setItem("ipjuon_payment_requests", JSON.stringify([request, ...existing]));
    localStorage.setItem("ipjuon_payment_status", "검토중");

    setSending(false);
    setPaymentStatus("검토중");
    setRequests([request, ...existing]);
    setSelectedTypes([]);
    setFiles([]);
    setMemo("");
    toast.success("✅ 납부완료 신청이 접수되었습니다");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <MobileLayout title="납부 확인 신청">
      <div className="animate-fade-in-content space-y-5">
        {/* 섹션 1: 현재 신청 상태 */}
        {paymentStatus === "미신청" && (
          <div className="rounded-xl border border-gray-100 p-5 text-center" style={{ background: "#F8FAFC" }}>
            <p className="text-3xl mb-2">📋</p>
            <p className="text-sm font-semibold text-foreground">납부 영수증을 업로드하고</p>
            <p className="text-sm font-semibold text-foreground">납부완료를 신청해 주세요</p>
            <p className="text-xs text-muted-foreground mt-2">승인 완료 시 입주증이</p>
            <p className="text-xs text-muted-foreground">자동으로 발급됩니다</p>
          </div>
        )}

        {paymentStatus === "검토중" && (
          <div className="rounded-xl border border-yellow-200 p-5 text-center" style={{ background: "#FEF9C3" }}>
            <p className="text-3xl mb-2">🕐</p>
            <p className="text-sm font-semibold text-yellow-800">관리자 검토 중</p>
            <p className="text-xs text-yellow-700 mt-2">납부 확인 신청이 접수되었습니다.</p>
            <p className="text-xs text-yellow-700">1시간이 지나도 승인이 되지 않으면</p>
            <p className="text-xs text-yellow-700">입주자지원센터로 연락 부탁드립니다.</p>
          </div>
        )}

        {paymentStatus === "승인완료" && (
          <div className="rounded-xl border border-green-200 p-5 text-center" style={{ background: "#D1FAE5" }}>
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm font-semibold text-green-800">납부 확인 완료</p>
            <p className="text-xs text-green-700 mt-1">입주증 발급이 가능합니다</p>
            <button
              onClick={() => navigate("/certificate")}
              className="text-sm text-green-700 underline mt-3 inline-block"
            >
              입주증 확인하기 →
            </button>
          </div>
        )}

        {/* 섹션 2: 영수증 업로드 (미신청 시만) */}
        {paymentStatus === "미신청" && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground">납부 영수증 첨부</p>

              {/* 납부 유형 선택 */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">해당하는 항목을 모두 선택해 주세요</p>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_TYPES.map(type => {
                    const selected = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          selected
                            ? "border-[#3B82F6] bg-[#EFF6FF] text-foreground"
                            : "border-gray-200 bg-white text-foreground"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                          selected ? "bg-[#3B82F6] border-[#3B82F6] text-white" : "border-gray-300"
                        }`}>
                          {selected && "✓"}
                        </span>
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 파일 업로드 */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                hidden
                onChange={handleFileChange}
              />

              {files.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-3xl mb-2">📎</p>
                  <p className="text-sm font-semibold text-foreground">영수증을 첨부해 주세요</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG 가능</p>
                  <p className="text-xs text-muted-foreground">파일당 최대 10MB</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                  >
                    파일 선택
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file, i) => (
                    <div key={i} className="rounded-lg border p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {isImage(file) ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-10 h-10 object-cover rounded shrink-0"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-muted-foreground shrink-0 p-2" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} className="p-1 text-muted-foreground hover:text-foreground shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {files.length < 5 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      + 파일 추가
                    </button>
                  )}
                </div>
              )}

              {/* 메모 */}
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">관리자에게 전달할 내용 (선택사항)</p>
                <textarea
                  rows={3}
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  placeholder="예) 중도금 3차까지 납부 완료"
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* 섹션 3: 신청 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || sending}
              className={`w-full h-12 rounded-xl text-base font-semibold text-white transition-opacity flex items-center justify-center gap-2 ${
                isValid && !sending
                  ? "bg-primary hover:opacity-90"
                  : "bg-primary opacity-40 cursor-not-allowed"
              }`}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  신청 중...
                </>
              ) : (
                "납부완료 신청하기"
              )}
            </button>
          </>
        )}

        {/* 섹션 4: 신청 내역 */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-foreground">신청 내역</p>
          {requests.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">아직 신청 내역이 없습니다</p>
          ) : (
            requests.map(req => (
              <div key={req.id} className="rounded-xl border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">납부완료 신청</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      req.status === "검토중"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{req.date}</p>
                <div className="space-y-0.5">
                  {req.types.map(t => (
                    <p key={t} className="text-xs text-foreground">· {t}</p>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  첨부: {req.fileNames.length === 1
                    ? req.fileNames[0]
                    : `${req.fileNames[0]} 외 ${req.fileNames.length - 1}건`}
                </p>
                {req.memo && (
                  <p className="text-xs text-muted-foreground">메모: {req.memo}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default PaymentPage;
