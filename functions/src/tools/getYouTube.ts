import axios from "axios";
import { z } from "genkit";
import dotenv from "dotenv";

import ai from "../core/genkit";
import parseISO8601Duration from "../utils/parseISO8601Duration";

dotenv.config();

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

const getYouTube = ai.defineTool(
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

export default getYouTube;
