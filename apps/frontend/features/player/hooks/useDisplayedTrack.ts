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

  const { data: trackResult } = useQuery<Track & TrackDetail>({
    enabled: trackSource?.from === "manual",
    queryKey: ["track", trackId],
    staleTime: Infinity,
    throwOnError: true,

    queryFn: () => {
      if (!trackId) throw new Error("No track ID provided");
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

  const { data: trackStreamResult } = useQuery({
    enabled: trackSource?.from === "device",
    queryKey: ["track-stream", trackStreamKey],
    throwOnError: true,

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
        else throw new Error("No track info provided");
      },
    }),
  });

  // ========== track to be displayed ==========
  const displayedTrack: Partial<Track & TrackDetail> | undefined =
    useMemo(() => {
      if (trackSource?.from === "manual" && trackResult) return trackResult;
      else if (trackSource?.from === "device" && trackStreamResult)
        return trackStreamResult;
      return trackSource?.track;
    }, [trackSource, trackResult, trackStreamResult]);

  return displayedTrack;
}
