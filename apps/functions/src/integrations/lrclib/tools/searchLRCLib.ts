import axios from "axios";
import { z } from "genkit";

import { ai } from "@/config";
import parseLyrics from "@/shared/utils/parseLyrics";

export const SearchLRCLibInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  duration: z.number().describe("The duration of the song in seconds"),
});

export const SearchLRCLibOutputSchema = z
  .object({
    lyrics: z.array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
    ),
    title: z.string().describe("The title of the song"),
    artist: z.string().describe("The artist of the song"),
    album: z.string().describe("The album of the song"),
    duration: z.number().describe("The duration of the song in seconds"),
  })
  .nullable();

export interface LRCLIBSearchItem {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string | null;
}

export const searchLRCLib = ai.defineTool(
  {
    name: "searchLRCLib",
    inputSchema: SearchLRCLibInputSchema,
    outputSchema: SearchLRCLibOutputSchema,
    description:
      "Fetch the lyrics, title, artist and album of a song given its title, artist and duration in seconds from LRCLib",
  },
  async ({ title, artist, duration }) => {
    const response = await axios.get<LRCLIBSearchItem[]>("https://lrclib.net/api/search", {
      params: { track_name: title, artist_name: artist },
    });

    if (response.status !== 200) throw new Error("Failed to fetch lyrics from LRCLib");

    // 가사 후보들
    const songs = response.data;

    // 후보 검증
    let song: LRCLIBSearchItem | null = null;
    for (const candidate of songs) {
      if (Math.abs(candidate.duration - duration) > 2) continue;
      const { syncedLyrics: lyricsString } = candidate;
      if (lyricsString === null || lyricsString === "") continue;
      song = candidate;
      break;
    }

    // 적합한 후보가 없으면 null 반환
    if (song === null) {
      return null;
    }

    // 형식 변환
    const { syncedLyrics } = song;
    if (!syncedLyrics) throw new Error("Synced lyrics not found");
    const lyrics = parseLyrics(syncedLyrics, duration);

    return {
      lyrics,
      title: song.name,
      artist: song.artistName,
      album: song.albumName,
      duration: song.duration,
    };
  }
);
