import { ERROR_CODES } from "@lymo/schemas/error";
import { StoryRequestSchema } from "@lymo/schemas/rtdb";
import { logger } from "firebase-functions";
import { onValueCreated } from "firebase-functions/database";
import { defineSecret } from "firebase-functions/params";

import KnownError from "@/shared/errors/KnownError";
import { getOrCreateTrack } from "@/shared/tools/getOrCreateTrack";

import { ensureDefaultStory } from "./helpers";

const spotifyClientSecret = defineSecret("SPOTIFY_CLIENT_SECRET");

export const onStoryRequestCreate = onValueCreated(
  {
    ref: "/storyRequests/{requestId}",
    region: "us-central1",
    timeoutSeconds: 300,
    secrets: [spotifyClientSecret],
  },
  async (event) => {
    try {
      if (!event.data) return;

      const requestId = event.params.requestId;
      const request = event.data.val();
      const input = StoryRequestSchema.parse(request);

      if (input.status !== "PENDING") throw new KnownError(ERROR_CODES.INVALID_INPUT);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { language, status, ...trackParams } = input;

      // 2) 트랙 조회 또는 생성
      const track = await getOrCreateTrack(trackParams);

      // 3) 곡 해석 생성 및 저장
      await ensureDefaultStory({ track: track.data, trackId: track.id, requestId, language });
    } catch (error) {
      if (error instanceof KnownError) {
        logger.info(`An error occurred in \`onStoryRequestCreate\`: ${error.code}`, error);
        return;
      }

      logger.error(`An unexpected error occurred in \`onStoryRequestCreate\``, error);
    }
  }
);
