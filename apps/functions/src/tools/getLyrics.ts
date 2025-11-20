import { LyricsDoc, LyricsDocSchema } from "@lymo/schemas/doc";
import { LyricsProviderSchema } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { z } from "genkit";
import { logger } from "genkit/logging";

import ai from "@/core/genkit";
import getLyricsFromDB from "@/helpers/getLyricsFromDB";
import getLyricsFromLRCLIB from "@/helpers/getLyricsFromLRCLIB";

export const GetLyricsToolInputSchema = z.object({
  metadata: z.object({
    title: z.string(),
    artists: z.string().array(),
    duration: z.number(),
  }),
  lyricsProvider: LyricsProviderSchema,
  trackId: z.string(),
});

export const GetLyricsToolOutputSchema = LyricsDocSchema.nullable();

/**
 * @description 가사 정보를 가져오거나 검색하는 툴
 */
export const getLyricsTool = ai.defineTool(
  {
    name: "getLyricsTool",
    inputSchema: GetLyricsToolInputSchema,
    outputSchema: GetLyricsToolOutputSchema,
    description:
      "Fetch or search for the lyrics of a song given its title, artists, duration, and track ID. If the lyrics are already stored in the database, return them. Otherwise, search for the lyrics using the specified provider and store them in the database before returning.",
  },
  async (input) => {
    try {
      // 1) 가사가 이미 있으면 반환
      const existingLyricsDoc = await getLyricsFromDB(input.trackId, input.lyricsProvider);
      if (existingLyricsDoc) return existingLyricsDoc;

      // 2) 가사 검색하기
      let lyrics: LyricsDoc["lyrics"] | null = null;
      if (input.lyricsProvider === "lrclib") {
        lyrics =
          (
            await getLyricsFromLRCLIB(
              input.metadata.title,
              input.metadata.artists,
              input.metadata.duration
            )
          )?.lyrics ?? null;
      }

      // 3) 가사가 없으면 null 반환
      if (!lyrics) return null;

      // 4) 가사 DB에 저장하기
      const lyricsDocRef = admin
        .firestore()
        .collection("tracks")
        .doc(input.trackId)
        .collection("lyrics")
        .doc(input.lyricsProvider) as DocumentReference<LyricsDoc>;

      const lyricsDoc: LyricsDoc = { lyrics };
      await lyricsDocRef.set(lyricsDoc);

      // 5) 최종 결과 반환
      return lyricsDoc;
    } catch (error) {
      logger.error("An error occurred in getLyricsFlow", error);
      throw error;
    }
  }
);
