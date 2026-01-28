import {
  RetrieveTrackInputSchema as InputSchema,
  RetrieveTrackOutputSchema as OutputSchema,
} from "@lymo/schemas/functions";
import { logger } from "firebase-functions";

import { ai } from "@/config";
import KnownError from "@/shared/errors/KnownError";
import { getOrCreateTrack } from "@/shared/tools/getOrCreateTrack";

export const retrieveTrack = ai.defineFlow(
  {
    name: "retrieveTrack",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
  },
  async (input) => {
    try {
      const track = await getOrCreateTrack(input);
      return { success: true as const, data: track };
    } catch (error) {
      if (error instanceof KnownError) {
        logger.info(`An error occurred in \`retrieveTrack\`: ${error.code}`, error);
        return { success: false as const, error: error.code, message: error.message };
      }
      logger.error(`An unexpected error in \`retrieveTrack\``, error);
      throw error;
    }
  }
);
