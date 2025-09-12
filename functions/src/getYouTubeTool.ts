import axios from "axios";
import { z } from "genkit";
import type { Genkit } from "genkit";

const getYouTubeInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

const getYouTubeOutputSchema = z.object({
  videoId: z.string().describe("The YouTube video ID of the song"),
  duration: z.number().describe("The duration of the song in seconds"),
});

type YouTubeSearchResponse = {
  items: { id: { videoId: string } }[];
};

type YouTubeVideoResponse = {
  items: { contentDetails: { duration: string } }[];
};

/**
 * ISO 8601 형식의 기간 문자열을 초 단위로 변환합니다.
 * @param duration ISO 8601 형식의 기간 문자열 (예: "PT1H2M3S")
 * @returns 초 단위로 변환된 기간 (예: 3723)
 */
function parseISO8601Duration(duration: string): number {
  // 정규 표현식을 사용하여 시간 단위별로 숫자를 추출합니다.
  // P(n)Y(n)M(n)DT(n)H(n)M(n)S 형식에 대응합니다.
  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  // matches 배열의 인덱스는 정규식의 캡처 그룹에 해당합니다.
  // 1: Years, 2: Months, 3: Days, 4: Hours, 5: Minutes, 6: Seconds
  const hours = parseFloat(matches[4] || "0");
  const minutes = parseFloat(matches[5] || "0");
  const seconds = parseFloat(matches[6] || "0");

  // 년(Y), 월(M), 일(D)은 길이가 가변적이므로 이 함수에서는 계산하지 않습니다.
  // 필요하다면 특정 기준(예: 1년=365일)을 정하고 추가해야 합니다.
  if (matches[1] || matches[2] || matches[3]) {
    console.warn(
      "This function only calculates H, M, S components. Y, M, D are ignored."
    );
  }

  // 총 초를 계산하여 반환합니다.
  return hours * 3600 + minutes * 60 + seconds;
}

export const registerGetYouTubeTool = (ai: Genkit) =>
  ai.defineTool(
    {
      name: "getYouTube",
      inputSchema: getYouTubeInputSchema,
      outputSchema: getYouTubeOutputSchema,
      description:
        "Fetch the YouTube video ID and duration of a song given its title and artist",
    },
    async ({ title, artist }) => {
      // 유튜브 비디오 검색
      const searchResponse = await axios.get<YouTubeSearchResponse>(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            part: "id",
            q: `${title} ${artist} audio`,
            type: "video",
            videoEmbeddable: "true",
            videoSyndicated: "true",
          },
        }
      );

      if (searchResponse.status !== 200)
        throw new Error("Failed to fetch video from YouTube");
      if (searchResponse.data.items.length === 0)
        throw new Error("No video found on YouTube");

      const videoId = searchResponse.data.items[0].id.videoId;

      // 유튜브 비디오 길이 조회
      const videoResponse = await axios.get<YouTubeVideoResponse>(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            part: "contentDetails",
            id: videoId,
          },
        }
      );

      if (videoResponse.status !== 200)
        throw new Error("Failed to fetch video details from YouTube");
      if (videoResponse.data.items.length === 0)
        throw new Error("No video found on YouTube");

      const duration = parseISO8601Duration(
        videoResponse.data.items[0].contentDetails.duration
      );

      return { videoId, duration };
    }
  );
