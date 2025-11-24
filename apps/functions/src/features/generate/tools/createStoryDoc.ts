import { Story } from "@lymo/schemas/doc";
import { LanguageSchema, LyricsProviderSchema } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "genkit";

import ai from "@/core/genkit";

const InputSchema = z.object({
  trackInfo: z.object({
    trackId: z.string(),
    trackTitle: z.string(),
    trackArtists: z.string().array(),
    trackAlbum: z.string().nullable(),
    trackAlbumArt: z.string(),
  }),

  userInfo: z.object({
    userId: z.string(),
    userName: z.string(),
    userAvatar: z.string().nullable(),
  }),

  config: z.object({
    language: LanguageSchema,
    lyricsProvider: LyricsProviderSchema,
  }),
});

const OutputSchema = z.string().nullable();

export const createStoryDoc = ai.defineTool(
  {
    name: "createStoryDoc",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    description: "Create a story document in DB",
  },
  async ({ trackInfo, userInfo, config }) => {
    const storyCollectionRef = admin
      .firestore()
      .collection("stories") as CollectionReference<Story>;
    const newStoryRef = storyCollectionRef.doc();

    const now = new Date().toISOString();

    await newStoryRef.create({
      ...trackInfo,
      ...userInfo,
      ...config,

      updatedAt: now,
      stats: {
        favoriteCount: 0,
        viewCount: 0,
      },
      status: "PENDING",
    });

    return newStoryRef.id;
  }
);
