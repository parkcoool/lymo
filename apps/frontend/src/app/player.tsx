import { ErrorBoundaryProps, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import ErrorIndicator from "@/features/player/components/ErrorIndicator";
import PlayerPage from "@/features/player/components/PlayerPage";
import { useSyncStore } from "@/shared/models/syncStore";

export default function Page() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const { trackSource, setTrackSource } = useTrackSourceStore();
  const { deviceMedia } = useDeviceMediaStore();
  const { setIsSynced } = useSyncStore();

  // 알림에서 재생 요청이 온 경우, 동기화 처리
  useEffect(() => {
    if (source === "notification") {
      if (trackSource || !deviceMedia) return;
      setIsSynced(true);
      setTrackSource({ from: "device", track: deviceMedia });
    }
  }, [deviceMedia, setIsSynced, setTrackSource, source, trackSource]);

  return <PlayerPage />;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorIndicator {...props} />;
}
