import { useState, useEffect, useCallback } from "react";

const STAGE_KEY = "movein_stage_flags";

interface StageFlags {
  isContractDone: boolean;
  isInspectionDone: boolean;
  isMovingReserved: boolean;
  isPaymentDone: boolean;
}

const defaultFlags: StageFlags = {
  isContractDone: true,
  isInspectionDone: false,
  isMovingReserved: false,
  isPaymentDone: false,
};

function loadFlags(): StageFlags {
  try {
    const stored = localStorage.getItem(STAGE_KEY);
    if (stored) return { ...defaultFlags, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultFlags;
}

function calcStage(flags: StageFlags): number {
  if (flags.isPaymentDone) return 5;
  if (flags.isMovingReserved) return 4;
  if (flags.isInspectionDone) return 3;
  if (flags.isContractDone) return 2;
  return 1;
}

export const useStage = () => {
  const [flags, setFlags] = useState<StageFlags>(loadFlags);
  const stage = calcStage(flags);

  // Listen for changes from other tabs/components
  useEffect(() => {
    const handler = () => setFlags(loadFlags());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateFlag = useCallback((key: keyof StageFlags, value: boolean) => {
    setFlags((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { stage, flags, updateFlag };
};
