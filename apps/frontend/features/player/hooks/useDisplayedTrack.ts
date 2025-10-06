import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import getTrack from "@/features/track/apis/getTrack";

export default function useDisplayedTrack() {
  const { trackSource } = useTrackSourceStore();

  const trackId = useMemo(() => {
    if (trackSource?.from === "manual") return trackSource.track.id;
    else return undefined;
  }, [trackSource]);

  const { data: trackFromManual } = useQuery<Track & TrackDetail>({
    enabled: trackSource?.from === "manual",
    queryKey: ["track", trackId],
    queryFn: () => {
      if (!trackId) throw new Error("No track ID provided");
      return getTrack({ trackId });
    },
    staleTime: Infinity,
    throwOnError: true,
  });

  const displayedTrack: Partial<Track & TrackDetail> | undefined =
    useMemo(() => {
      if (trackSource?.from === "manual" && trackFromManual)
        return trackFromManual;

      return trackSource?.track;
    }, [trackSource, trackFromManual]);

  return displayedTrack;
}
