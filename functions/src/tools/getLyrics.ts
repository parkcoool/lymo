import axios from "axios";
import { z } from "genkit";

import parseLyrics from "../utils/parseLyrics";
import ai from "../core/genkit";

const getLyricsInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  duration: z.number().describe("The duration of the song in seconds"),
});

const getLyricsOutputSchema = z.object({
  lyrics: z.array(
    z.tuple([
      z.number().describe("The start time of the sentence in seconds"),
      z.string().describe("The text of the sentence"),
    ])
  ),
});

type LRCLibSearchResponse = {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string | null;
}[];

const getLyrics = ai.defineTool(
  {
    name: "getLyrics",
    inputSchema: getLyricsInputSchema,
    outputSchema: getLyricsOutputSchema,
    description:
      "Fetch the lyrics of a song given its title, artist and duration in seconds",
  },
  async ({ title, artist, duration }) => {
    const response = await axios.get<LRCLibSearchResponse>(
      "https://lrclib.net/api/search",
      {
        params: { track_name: title, artist_name: artist },
      }
    );

    if (response.status !== 200)
      throw new Error("Failed to fetch lyrics from LRCLib");

    // 가사 후보들
    const songs = response.data;

    // 후보 검증
    let lyricsString: string | null = null;
    for (const song of songs) {
      if (Math.abs(song.duration - duration) > 5) continue;
      if (song.syncedLyrics === null || song.syncedLyrics === "") continue;
      lyricsString = song.syncedLyrics;
      break;
    }

    if (lyricsString === null) return { lyrics: [] };

    // 형식 변환
    const lyrics = parseLyrics(lyricsString);
    return { lyrics };
  }
);

export default getLyrics;
