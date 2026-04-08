import { useState } from "react";
import { WifiOff, Upload, Trash2, X, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { OfflineDraft } from "@/hooks/useOfflineDrafts";
import { toast } from "sonner";

interface OfflineDraftVaultProps {
  drafts: OfflineDraft[];
  syncing: boolean;
  onSyncAll: () => void;
  onRemoveDraft: (id: string) => void;
}

const OfflineDraftVault = ({ drafts, syncing, onSyncAll, onRemoveDraft }: OfflineDraftVaultProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (drafts.length === 0) return null;

  const handleSync = () => {
    if (!navigator.onLine) {
      toast.error("네트워크 연결을 확인해주세요.");
      return;
    }
    onSyncAll();
  };

  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-amber-800">
                보관함에 {drafts.length}건이 저장되어 있습니다.
              </p>
              <p className="text-[10px] text-amber-600">온라인 연결 후 전송해주세요</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 text-amber-700 text-xs font-bold px-2 py-1.5 rounded-lg border border-amber-300 active:scale-95"
            >
              <Eye className="w-3 h-3" />
              보관함
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-1 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 disabled:opacity-50"
            >
              {syncing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {syncing ? "전송 중..." : "전송하기"}
            </button>
          </div>
        </div>
      </div>

      {/* Vault detail modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[360px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base">📦 오프라인 보관함</DialogTitle>
            <DialogDescription className="text-xs">
              저장된 하자 접수 {drafts.length}건
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {draft.data.location || "위치 미지정"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(draft.timestamp).toLocaleString("ko-KR")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {draft.data.guide_items?.join(", ") || "항목 없음"} · 📷 {draft.data.photo_count}장
                  </p>
                </div>
                <button
                  onClick={() => onRemoveDraft(draft.id)}
                  className="ml-2 p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={() => { handleSync(); setModalOpen(false); }}
            disabled={syncing}
            className="w-full h-11 rounded-xl font-bold"
          >
            {syncing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                전송 중...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                전체 전송 ({drafts.length}건)
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OfflineDraftVault;
