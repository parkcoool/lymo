import { StoryRequestSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";
import { defineSecret } from "firebase-functions/params";

import CommonError from "@/features/shared/errors/CommonError";
import { getOrCreateTrack } from "@/features/shared/tools/getOrCreateTrack";

import { ensureDefaultStory } from "./helpers";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

export const onStoryRequestCreate = onDocumentCreated(
  {
    document: "storyRequests/{requestId}",
    secrets: [spotifyClientSecret],
  },
  async (event) => {
    try {
      if (!event.data) return;

      const requestId = event.data.id;
      const request = event.data.data();
      const input = StoryRequestSchema.parse(request);

      if (input.status !== "PENDING") throw new CommonError(ERROR_CODES.INVALID_INPUT);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { language, status, ...trackParams } = input;

      // 2) 트랙 조회 또는 생성
      const track = await getOrCreateTrack(trackParams);

      // 3) 곡 해석 생성 및 저장
      await ensureDefaultStory({ track: track.data, trackId: track.id, requestId, language });
    } catch (error) {
      if (error instanceof CommonError) {
        logger.info(`An error occurred in \`onStoryRequestCreate\`: ${error.code}`, error);
        return;
      }

      logger.error(`An unexpected error occurred in \`onStoryRequestCreate\``, error);
    }
  }
);
