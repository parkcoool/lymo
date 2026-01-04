import { StorySchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { z } from "genkit";

import { ai } from "@/config";

const InputSchema = z.object({
  story: StorySchema,
  requestId: z.string(),
});

const OutputSchema = z.void();

export const copyStoryDoc = ai.defineTool(
  {
    name: "copyStoryDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Copy a story document into a storyRequest database.",
  },
  async ({ story, requestId }) => {
    const storyRequestRef = admin.database().ref(`storyRequests/${requestId}`);

    await storyRequestRef.set({
      ...story,
      status: "COMPLETED",
    });
  }
);
