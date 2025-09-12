import axios from "axios";
import dotenv from "dotenv";
import { z } from "genkit";
import type { Genkit } from "genkit";

dotenv.config();

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

/**
 * `[MM:SS.SS] 가사` 형식의 문자열을 [시간(초), 가사] 쌍의 배열로 변환합니다.
 * @param lyricsString - 변환할 원본 가사 문자열
 * @returns [number, string][] 형식의 배열
 */
function parseLyrics(lyricsString: string): [number, string][] {
  // 1. 문자열을 줄바꿈(\n) 기준으로 나눕니다.
  const lines = lyricsString.split("\n");

  // 2. 각 줄을 순회하며 [시간, 가사] 형태로 변환합니다.
  const parsedData = lines
    .map((line) => {
      // 정규식을 사용해 [MM:SS.SS] 형식과 가사를 분리합니다.
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);

      // 패턴이 일치하지 않는 줄(예: 빈 줄)은 건너뜁니다.
      if (!match) {
        return null;
      }

      // 캡처된 그룹에서 분, 초, 가사를 추출합니다.
      // match[1]: 분(MM), match[2]: 초(SS.SS), match[3]: 가사
      const [, minutes, seconds, lyricsText] = match;

      // 타임스탬프를 총 초 단위로 계산합니다.
      const totalSeconds = parseInt(minutes, 10) * 60 + parseFloat(seconds);

      // 가사 양쪽의 공백을 제거하고, 계산된 시간과 함께 배열로 반환합니다.
      return [totalSeconds, lyricsText.trim()];
    })
    // 3. null 값을 필터링하여 유효한 데이터만 남깁니다.
    .filter((item): item is [number, string] => item !== null);

  return parsedData;
}

export const registerGetLyricsTool = (ai: Genkit) =>
  ai.defineTool(
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
