/// <reference types="vite/client" />

interface WakeLockSentinel {
  released: boolean;
  type: "screen";
  release(): Promise<void>;
}

interface Navigator {
  wakeLock?: {
    request(type: "screen"): Promise<WakeLockSentinel>;
  };
}
