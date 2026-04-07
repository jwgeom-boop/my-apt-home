import { useState, useEffect, useCallback } from "react";

function calcStage(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check moving completion
  try {
    const movingRes = localStorage.getItem("movingReservation");
    if (movingRes) {
      const moving = JSON.parse(movingRes);
      if (moving.status === "confirmed") {
        const movingDate = new Date(moving.date);
        movingDate.setHours(0, 0, 0, 0);
        const dayAfterMoving = new Date(movingDate);
        dayAfterMoving.setDate(movingDate.getDate() + 1);
        if (today >= dayAfterMoving) return 5;
        return 4;
      }
    }
  } catch {}

  // Check inspection reservation
  try {
    const inspRes = localStorage.getItem("inspectionReservation");
    if (inspRes) {
      const inspection = JSON.parse(inspRes);
      if (inspection.status === "confirmed") {
        const inspDate = new Date(inspection.date);
        inspDate.setHours(0, 0, 0, 0);
        const dayAfterInspection = new Date(inspDate);
        dayAfterInspection.setDate(inspDate.getDate() + 1);
        if (today >= dayAfterInspection) return 3;
        return 2;
      }
    }
  } catch {}

  // Contract is done by default
  return 2;
}

export const useStage = () => {
  const [stage, setStage] = useState(calcStage);

  useEffect(() => {
    const handler = () => setStage(calcStage());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const refresh = useCallback(() => setStage(calcStage()), []);

  return { stage, refresh };
};
