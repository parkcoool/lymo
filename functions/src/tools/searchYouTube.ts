import * as yt from "youtube-search-without-api-key";
import { z } from "genkit";

import parseDuration from "../utils/parseDuration";
import ai from "../core/genkit";

export const getYouTubeInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const getYouTubeOutputSchema = z.array(
  z.object({
    videoId: z.string().describe("The YouTube video ID"),
    videoTitle: z.string().describe("The YouTube video title"),
    duration: z.number().describe("The duration of the video in seconds"),
  })
);

export type YouTubeVideo = z.infer<typeof getYouTubeOutputSchema>[number];

export const searchYouTube = ai.defineTool(
  {
    name: "searchYouTube",
    inputSchema: getYouTubeInputSchema,
    outputSchema: getYouTubeOutputSchema,
    description:
      "Fetch the list of YouTube video ID, title, and duration given the song title and artist.",
  },
  async ({ title, artist }) => {
    // 유튜브 비디오 검색
    const videos = await yt.search(`${title} ${artist} lyrics`);
    const result = videos.map((video) => {
      const videoId: string = video.id.videoId;
      const videoTitle: string = video.snippet.title;
      const duration: number = parseDuration(video.snippet.duration);

      return { videoId, videoTitle, duration };
    });
    return result;
  }
);
