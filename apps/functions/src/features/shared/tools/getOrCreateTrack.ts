import { Track, TrackSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { z } from "genkit";

import ai from "@/core/genkit";
import CommonError from "@/features/shared/errors/CommonError";
import getLyricsFromLRCLIB from "@/features/shared/helpers/getLyricsFromLRCLIB";
import { createTrackDoc } from "@/features/shared/tools/createTrackDoc";
import { getTrackDoc } from "@/features/shared/tools/getTrackDoc";
import { searchSpotify } from "@/features/shared/tools/searchSpotify";

import { createRetrieveTrackCacheDoc } from "./createRetrieveTrackCacheDoc";
import { getRetrieveTrackCacheDoc } from "./getRetrieveTrackCacheDoc";

export const InputSchema = z.union([
  z.object({
    trackId: z.string(),
  }),

  z.object({
    title: z.string(),
    artist: z.string(),
    durationInSeconds: z.number(),
  }),
]);

export const OutputSchema = z.object({
  id: z.string(),
  data: TrackSchema,
});

export const getOrCreateTrack = ai.defineTool(
  {
    name: "getOrCreateTrack",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Retrieve a track from the database or create it if it doesn't exist",
  },
  async (input) => {
    // 1) title, artist, durationInSeconds를 전달한 경우 트랙 검색
    if ("title" in input && "artist" in input && "durationInSeconds" in input) {
      // 1-1) 캐시 조회
      {
        const trackId = await getRetrieveTrackCacheDoc(input);
        if (trackId) {
          const trackQuery = await getTrackDoc({ trackId });
          if (trackQuery) return trackQuery;
        }
      }

      // 1-2) 캐시 miss 시 외부 API에서 조회
      const spotifyResult = await searchSpotify(input);
      if (!spotifyResult) throw new CommonError(ERROR_CODES.EXTERNAL_TRACK_NOT_FOUND);
      const trackId = spotifyResult.id;

      // 1-3) LRCLIB에서 가사 검색
      const lrclibResult = await getLyricsFromLRCLIB({
        title: spotifyResult.title,
        artists: spotifyResult.artists,
        duration: spotifyResult.durationInSeconds,
      });
      if (!lrclibResult) throw new CommonError(ERROR_CODES.LYRICS_NOT_FOUND);

      // 1-4) 곡 데이터 준비
      const now = new Date().toISOString();
      const track: Track = {
        title: spotifyResult.title,
        artists: spotifyResult.artists,
        album: spotifyResult.album,
        albumArt: spotifyResult.albumArt,
        durationInSeconds: spotifyResult.durationInSeconds,
        publishedAt: spotifyResult.publishedAt,
        lyrics: { lrclib: lrclibResult.lyrics },
        createdAt: now,
        stats: { storyCount: 0, viewCount: 0 },
      };

      // 1-5) 캐시 문서 생성
      await createRetrieveTrackCacheDoc({ ...input, trackId });

      // 1-6) 문서 생성 및 반환
      await createTrackDoc({ trackId, track });
      return { id: trackId, data: track };
    }

    // 2) trackId를 전달한 경우
    else {
      const trackQuery = await getTrackDoc(input);
      if (trackQuery) return trackQuery;

      throw new CommonError(ERROR_CODES.TRACK_NOT_FOUND);
    }
  }
);
