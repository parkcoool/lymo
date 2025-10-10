import { useMemo } from "react";
import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import getTrack from "@/features/track/apis/getTrack";
import addTrack from "@/features/track/apis/addTrack";

export default function useDisplayedTrack() {
  const { trackSource } = useTrackSourceStore();

  // ========== trackSource.from: "manual" ==========
  const trackId = useMemo(() => {
    if (trackSource?.from === "manual") return trackSource.track.id;
    else return undefined;
  }, [trackSource]);

  const {
    data: trackResult,
    isError: isManualError,
    error: manualError,
    isLoading: isManualLoading,
  } = useQuery<Track & TrackDetail>({
    enabled: trackSource?.from === "manual",
    queryKey: ["track", trackId],
    staleTime: Infinity,
    retry: false,

    queryFn: () => {
      if (!trackId) throw new Error("곡 ID가 제공되지 않았습니다.");
      return getTrack({ trackId });
    },
  });

  // ========== trackSource.from: "device" ==========
  const trackStreamKey = useMemo(() => {
    if (trackSource?.from === "device")
      return {
        title: trackSource.track.title,
        artist: trackSource.track.artist,
        duration: trackSource.track.duration,
      };
    else return undefined;
  }, [trackSource]);

  const {
    data: trackStreamResult,
    isError: isDeviceError,
    error: deviceError,
    isLoading: isDeviceLoading,
  } = useQuery({
    enabled: trackSource?.from === "device",
    queryKey: ["track-stream", trackStreamKey],
    retry: false,

    queryFn: streamedQuery<Track & TrackDetail, Track & TrackDetail>({
      initialValue: {
        id: "",
        title: "",
        artist: "",
        album: null,
        coverUrl: "",
        publishedAt: null,
        duration: 0,
        lyrics: [],
        lyricsProvider: "",
        summary: "",
      },
      reducer: (_, chunk) => chunk,
      streamFn: (context) => {
        if (trackStreamKey) return addTrack(trackStreamKey, context.signal);
        else throw new Error("곡 정보가 제공되지 않았습니다.");
      },
    }),
  });

  // ========== track to be displayed ==========
  const displayedTrack: Partial<Track & TrackDetail> | undefined =
    useMemo(() => {
      // trackSource.from 우선순위에 따라 트랙 반환
      if (trackSource?.from === "manual" && trackResult) return trackResult;
      else if (trackSource?.from === "device" && trackStreamResult)
        return trackStreamResult;

      // placeholder 트랙 반환
      return trackSource?.track;
    }, [trackSource, trackResult, trackStreamResult]);

  const isLoading = useMemo(
    () => isDeviceLoading || isManualLoading,
    [isDeviceLoading, isManualLoading]
  );

  const isError = useMemo(
    () => isDeviceError || isManualError,
    [isDeviceError, isManualError]
  );

  const error = useMemo(() => {
    if (isDeviceError) return deviceError;
    else if (isManualError) return manualError;
    else return undefined;
  }, [isDeviceError, isManualError, deviceError, manualError]);

  return { displayedTrack, isLoading, error, isError };
}
