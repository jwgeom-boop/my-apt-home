import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const NetworkStatusBanner = () => {
  const { isOnline, showRecovered } = useNetworkStatus();

  if (isOnline && !showRecovered) return null;

  return (
    <div
      className={`sticky top-0 z-50 text-center py-2 text-sm font-semibold text-white transition-colors ${
        isOnline ? "bg-green-500" : "bg-destructive"
      }`}
    >
      {isOnline
        ? "✅ 인터넷 연결이 복구되었습니다."
        : "⚠️ 인터넷 연결이 끊겼습니다."}
    </div>
  );
};

export default NetworkStatusBanner;
