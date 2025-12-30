import { ERROR_CODES } from "@lymo/schemas/error";
import { RetrieveTrackInput } from "@lymo/schemas/functions";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "expo-router";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import retrieveTrack from "@/entities/track/api/retrieveTrack";
import KnownError from "@/shared/errors/KnownError";

/**
 * 현재 감상 중인 곡의 정보를 반환하는 훅입니다.
 */
export default function useCurrentTrack() {
  const { trackSource } = useTrackSourceStore();
  const pathname = usePathname();

  const isInPlayerPage = pathname.startsWith("/player");

  let retrieveTrackParams: RetrieveTrackInput | undefined = undefined;
  if (trackSource?.from === "device") {
    retrieveTrackParams = {
      title: trackSource.track.title,
      artist: trackSource.track.artist,
      durationInSeconds: trackSource.track.duration,
    };
  }

  const { data: track } = useQuery({
    queryKey: ["retrieve-track", retrieveTrackParams],
    queryFn: async () => {
      if (!retrieveTrackParams)
        throw new KnownError(
          ERROR_CODES.TRACK_NOT_FOUND,
          "기기에서 재생되는 곡을 불러올 수 없습니다."
        );
      return retrieveTrack(retrieveTrackParams);
    },
    select: (res) => {
      if (res.data.success) return res.data.data;
      throw new KnownError(res.data.error, res.data.message);
    },
    throwOnError: true,
    staleTime: 1000 * 60 * 5,
    enabled: isInPlayerPage && retrieveTrackParams !== undefined,
  });

  if (isInPlayerPage) {
    if (trackSource?.from === "manual") {
      const { id, ...data } = trackSource.track;
      return { id, data };
    }
    if (track) return track;
  }
}
