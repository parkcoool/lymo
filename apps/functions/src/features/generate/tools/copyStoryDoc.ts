import { StoryRequest, StorySchema } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

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
    description: "Copy a story document into a storyRequest document`",
  },
  async ({ story, requestId }) => {
    const storyRequestRef = admin
      .firestore()
      .collection("storyRequests")
      .doc(requestId) as DocumentReference<StoryRequest>;

    storyRequestRef.set({
      ...story,
      status: "COMPLETED",
    });
  }
);
