import { Track } from "@lymo/schemas/doc";
import {
  RetrieveTrackNotiInputSchema as InputSchema,
  RetrieveTrackNotiOutputSchema as OutputSchema,
} from "@lymo/schemas/functions";
import { logger } from "firebase-functions";

import ai from "@/core/genkit";
import { generateTrackInsightFlow } from "@/features/generate/flows/generateTrackInsight/flow";
import KnownError from "@/features/shared/errors/KnownError";
import { getTrackDoc } from "@/features/shared/tools/getTrackDoc";
import { searchSpotify } from "@/features/shared/tools/searchSpotify";

const TRIVIA_SCORE_WEIGHT = 0.5;
const DEPTH_SCORE_WEIGHT = 0.3;
const IMPACT_SCORE_WEIGHT = 0.2;
const SCORE_THRESHOLD = 6.0;

export const retrieveTrackNoti = ai.defineFlow(
  {
    name: "retrieveTrackNoti",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async ({ language, datetime, weather, ...trackInfo }) => {
    try {
      let track: Track | undefined = undefined;

      // 1) 캐시 조회
      const cachedTrack = await getTrackDoc(trackInfo);
      if (cachedTrack) track = cachedTrack.data;

      // 2) 캐시 miss 시 외부 API에서 조회
      const spotifyResult = await searchSpotify(trackInfo);
      if (!spotifyResult) return { success: true as const, data: null };
      const retrievedTrack = await getTrackDoc({ trackId: spotifyResult.id });
      if (retrievedTrack) track = retrievedTrack.data;
      if (!track) return { success: true as const, data: null };

      // 3) 점수 계산
      if (track.scores) {
        const score =
          (track.scores.trivia * TRIVIA_SCORE_WEIGHT +
            track.scores.depth * DEPTH_SCORE_WEIGHT +
            track.scores.impact * IMPACT_SCORE_WEIGHT) /
          10;
        if (0 < score && score < SCORE_THRESHOLD) return { success: true as const, data: null };
      }

      // 4) 문구 생성
      const insight = await generateTrackInsightFlow({
        trackInfo: {
          title: track.title,
          artists: track.artists,
          album: track.album,
        },
        lyrics: track.lyrics.lrclib?.map((lyric) => lyric.text) ?? [],
        config: {
          language,
          datetime,
          weather,
        },
      });

      // 5) 결과 반환
      return { success: true as const, data: insight };
    } catch (error) {
      if (error instanceof KnownError) {
        logger.info(`An error occurred in \`retrieveTrackNoti\`: ${error.code}`, error);
        return { success: false as const, error: error.code, message: error.message };
      }
      logger.error(`An unexpected error in \`retrieveTrackNoti\``, error);
      throw error;
    }
  }
);
