import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OfflineDraft {
  id: string;
  timestamp: string;
  data: {
    resident_id: string | null;
    receipt_no: string;
    location: string;
    mid_category: string;
    guide_items: string[];
    photo_count: number;
    photo_data: any[];
    is_urgent: boolean;
    status: string;
  };
}

const STORAGE_KEY = "defect_offline_drafts";

export const useOfflineDrafts = () => {
  const [drafts, setDrafts] = useState<OfflineDraft[]>([]);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  // Load drafts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDrafts(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const saveDraft = useCallback((data: OfflineDraft["data"]) => {
    const draft: OfflineDraft = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data,
    };
    setDrafts((prev) => {
      const next = [draft, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    toast({
      title: "📱 임시 저장 완료",
      description: "네트워크 연결 시 자동 전송됩니다.",
    });
    return draft;
  }, [toast]);

  const removeDraft = useCallback((id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const syncAll = useCallback(async () => {
    if (drafts.length === 0) return;
    setSyncing(true);
    let successCount = 0;
    let failCount = 0;

    for (const draft of drafts) {
      const { error } = await supabase.from("defects").insert(draft.data);
      if (!error) {
        removeDraft(draft.id);
        successCount++;
      } else {
        failCount++;
      }
    }

    setSyncing(false);
    toast({
      title: successCount > 0 ? "✅ 일괄 전송 완료" : "❌ 전송 실패",
      description: successCount > 0
        ? `${successCount}건 전송 완료${failCount > 0 ? `, ${failCount}건 실패` : ""}`
        : "네트워크를 확인해주세요.",
      variant: failCount > 0 && successCount === 0 ? "destructive" : "default",
    });
  }, [drafts, removeDraft, toast]);

  return { drafts, saveDraft, removeDraft, syncAll, syncing };
};
