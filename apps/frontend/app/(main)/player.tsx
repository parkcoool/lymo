import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { View } from "react-native";

import DeviceTrackPlayer from "@/components/player/DeviceTrackPlayer";
import ErrorIndicator from "@/components/player/ErrorIndicator";
import LoadingIndicator from "@/components/player/LoadingIndicator";
import ManualTrackPlayer from "@/components/player/ManualTrackPlayer";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

export default function Player() {
  const { trackSource } = useTrackSourceStore();

  return (
    <View style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorIndicator}>
        <Suspense fallback={<LoadingIndicator {...trackSource?.track} />}>
          {trackSource?.from === "manual" && <ManualTrackPlayer />}
          {trackSource?.from === "device" && <DeviceTrackPlayer />}
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}
