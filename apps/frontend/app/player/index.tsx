import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { ErrorBoundary } from "react-error-boundary";
import { View } from "react-native";

import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import ErrorIndicator from "@/features/player/components/ErrorIndicator";
import FromDevice from "@/features/player/components/Player/FromDevice";
import FromManual from "@/features/player/components/Player/FromManual";

export default function Player() {
  const { trackSource } = useTrackSourceStore();
  const { reset } = useQueryErrorResetBoundary();

  // 활성화된 곡이 없으면 홈으로 리다이렉트
  if (!trackSource) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorIndicator} onReset={reset}>
        {trackSource.from === "manual" && (
          <FromManual trackId={trackSource.track.id} track={trackSource.track} />
        )}
        {trackSource.from === "device" && (
          <FromDevice
            title={trackSource.track.title}
            artist={trackSource.track.artist}
            durationInSeconds={trackSource.track.duration}
          />
        )}
      </ErrorBoundary>
    </View>
  );
}
