import { useEffect } from "react";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useTrackStreamsStore } from "@/contexts/useTrackStreamsStore";
import addTrack from "@/features/track/apis/addTrack";
import type { TrackStreamResult } from "@/types/track";
import { Track, TrackDetail } from "@lymo/schemas/shared";
import { useSyncStore } from "@/contexts/useSyncStore";

export default function useStreamAddTrackEffect() {
  const { isSynced } = useSyncStore();
  const { data: deviceMedia } = useDeviceMediaStore();
  const { setTrackStream, getTrackStream } = useTrackStreamsStore();

  useEffect(() => {
    if (!isSynced) return;
    if (deviceMedia == null) return;

    const { title, artist, duration } = deviceMedia ?? {};

    const existingTrackStream = getTrackStream({ title, artist, duration });
    if (existingTrackStream) return;

    const newTrackStream = addTrack({ title, artist, duration });
    const trackStreamResult: TrackStreamResult = {
      duplicate: false,
      notFound: false,
      track: {
        id: "",
        title,
        artist,
        album: null,
        coverUrl: "",
        publishedAt: null,
        duration,
        lyrics: [],
        lyricsProvider: "",
        summary: "",
      },
    };

    (async () => {
      for await (const chunk of newTrackStream) {
        if (chunk.type === "chunk") {
          console.log("[CHUNK]", chunk.data);

          const { event, data } = chunk.data;
          if (trackStreamResult.track === undefined) continue;

          switch (event) {
            case "metadata_update": {
              Object.assign<Track & TrackDetail, Partial<Track & TrackDetail>>(
                trackStreamResult.track,
                data
              );
              break;
            }

            case "lyrics_set": {
              break;
            }

            case "translation_set": {
              break;
            }

            case "summary_append": {
              trackStreamResult.track.summary += data.summary;
              break;
            }

            case "paragraph_summary_append": {
              break;
            }

            case "complete": {
              break;
            }
          }
        } else if (chunk.type === "result") {
          console.log("[RESULT]", chunk.data);

          const { duplicate, notFound, id } = chunk.data;

          if (duplicate && id) {
            trackStreamResult.duplicate = true;
            trackStreamResult.trackId = id;
            trackStreamResult.track = undefined;
          } else if (notFound) {
            trackStreamResult.notFound = true;
            trackStreamResult.trackId = undefined;
            trackStreamResult.track = undefined;
          } else if (id) {
            trackStreamResult.trackId = id;
          }
        }

        setTrackStream({ title, artist, duration }, trackStreamResult);
      }
    })();
  }, [deviceMedia, isSynced]);
}
