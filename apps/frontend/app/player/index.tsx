import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { View } from "react-native";

import ErrorIndicator from "@/components/player/ErrorIndicator";
import LoadingIndicator from "@/components/player/LoadingIndicator";
import { TrackLoaderFromId, TrackLoaderFromMetadata } from "@/components/player/Player";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

export default function Player() {
  const { trackSource } = useTrackSourceStore();
  const { reset } = useQueryErrorResetBoundary();

  // 활성화된 곡이 없으면 홈으로 리다이렉트
  if (!trackSource) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorIndicator} onReset={reset}>
        <Suspense fallback={<LoadingIndicator {...trackSource?.track} />}>
          {trackSource.from === "manual" && <TrackLoaderFromId trackId={trackSource.track.id} />}
          {trackSource.from === "device" && (
            <TrackLoaderFromMetadata
              title={trackSource.track.title}
              artist={trackSource.track.artist}
              durationInSeconds={trackSource.track.duration}
            />
          )}
        </Suspense>
      </ErrorBoundary>
    </View>
  );
}
