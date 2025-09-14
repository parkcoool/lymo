import { z } from "genkit";

import ai from "../core/genkit";
import {
  searchLRCLib,
  searchLRCLibOutputSchema as trySearchLRCLibOutputSchema,
} from "./searchLRCLib";

export const trySearchLRCLibInputSchema = z.object({
  englishTitle: z.string().nullable().describe("The English title of the song"),
  koreanTitle: z.string().nullable().describe("The Korean title of the song"),
  englishArtist: z
    .string()
    .nullable()
    .describe("The English name of the artist"),
  koreanArtist: z.string().nullable().describe("The Korean name of the artist"),
  duration: z.number().describe("The duration of the song in seconds"),
});

export const trySearchLRCLib = ai.defineTool(
  {
    name: "searchLRCLib",
    inputSchema: trySearchLRCLibInputSchema,
    outputSchema: trySearchLRCLibOutputSchema,
    description: "",
  },
  async ({
    englishTitle,
    koreanTitle,
    englishArtist,
    koreanArtist,
    duration,
  }) => {
    const combinations: [string, string][] = [];

    // 가능한 모든 제목/아티스트명 조합 생성
    if (koreanTitle && koreanArtist)
      combinations.push([koreanTitle, koreanArtist]);
    if (englishTitle && englishArtist)
      combinations.push([englishTitle, englishArtist]);
    if (koreanTitle && englishArtist)
      combinations.push([koreanTitle, englishArtist]);
    if (englishTitle && koreanArtist)
      combinations.push([englishTitle, koreanArtist]);

    let lrclibResult: z.infer<typeof trySearchLRCLibOutputSchema> = null;
    for (const [tryTitle, tryArtist] of combinations) {
      const trySong = await searchLRCLib({
        title: tryTitle,
        artist: tryArtist,
        duration: duration,
      });

      // 음악을 못 찾았으면 다음 조합 시도
      if (trySong === null) continue;
      lrclibResult = trySong;
      break;
    }

    return lrclibResult;
  }
);
