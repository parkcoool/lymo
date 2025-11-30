import {
  RetrieveTrackInputSchema as InputSchema,
  RetrieveTrackOutputSchema as OutputSchema,
} from "@lymo/schemas/functions";

import ai from "@/core/genkit";
import CommonError from "@/features/shared/errors/CommonError";
import { getOrCreateTrack } from "@/features/shared/tools/getOrCreateTrack";

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
      if (error instanceof CommonError) {
        return { success: false as const, error: error.code, message: error.message };
      }
      throw error;
    }
  }
);
