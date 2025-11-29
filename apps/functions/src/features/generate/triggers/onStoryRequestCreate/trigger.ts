import { StoryRequestSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";

import CommonError from "@/features/shared/errors/CommonError";
import { searchSpotify } from "@/features/shared/tools/searchSpotify";

import { getTrackDoc } from "../../tools/getTrackDoc";

import { ensureDefaultStory } from "./helpers";

export const onStoryRequestCreate = onDocumentCreated(
  "storyRequests/{requestId}",
  async (event) => {
    try {
      if (!event.data) return;

      const requestId = event.data.id;
      const request = event.data.data();
      const input = StoryRequestSchema.parse(request);

      if (input.status !== "PENDING") throw new CommonError(ERROR_CODES.INVALID_INPUT);

      const { language } = input;
      let trackId: string;

      // 1-1) title, artist, durationInSeconds를 전달한 경우 Spotify에서 트랙 검색
      if ("title" in input && "artist" in input && "durationInSeconds" in input) {
        const { title, artist, durationInSeconds } = input;

        const spotifyResult = await searchSpotify({
          title,
          artist,
          durationInSeconds,
        });
        if (!spotifyResult) throw new CommonError(ERROR_CODES.EXTERNAL_TRACK_NOT_FOUND);
        trackId = spotifyResult.id;
      }

      // 1-2) trackId를 전달한 경우
      else {
        ({ trackId } = input);
      }

      // 2) DB에서 track 문서 가져오기
      const track = await getTrackDoc({ trackId });
      if (!track) throw new CommonError(ERROR_CODES.TRACK_NOT_FOUND);

      // 3) 곡 해석 생성 및 저장
      await ensureDefaultStory({ track, trackId, requestId, language });
    } catch (error) {
      if (error instanceof CommonError) {
        logger.error(`An error occurred in \`onStoryRequestCreate\`: ${error.code}`, error);
        return;
      }

      logger.error(`An unexpected error occurred in \`onStoryRequestCreate\``, error);
    }
  }
);
