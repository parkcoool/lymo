import { Story, StorySchema } from "@lymo/schemas/doc";
import { LanguageSchema } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  trackId: z.string(),
  userId: z.string(),
  language: LanguageSchema,
});

const OutputSchema = StorySchema.nullable();

export const getStoryFromDB = ai.defineTool(
  {
    name: "getStoryFromDB",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Retrieve a story document from DB",
  },
  async ({ trackId, userId, language }) => {
    const storyCollectionRef = admin
      .firestore()
      .collection("stories") as CollectionReference<Story>;
    const q = storyCollectionRef
      .where("trackId", "==", trackId)
      .where("userId", "==", userId)
      .where("language", "==", language)
      .limit(1);

    const story = (await q.get()).docs[0]?.data();
    return story ?? null;
  }
);
