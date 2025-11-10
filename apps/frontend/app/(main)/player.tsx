import { Redirect } from "expo-router";
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

  // 활성화된 곡이 없으면 홈으로 리다이렉트
  if (!trackSource) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorIndicator}>
        <Suspense fallback={<LoadingIndicator {...trackSource?.track} />}>
          {trackSource.from === "manual" && <ManualTrackPlayer />}
          {trackSource.from === "device" && <DeviceTrackPlayer />}
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}
