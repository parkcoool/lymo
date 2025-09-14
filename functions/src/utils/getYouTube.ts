import axios from "axios";
import { defineSecret } from "firebase-functions/params";

import parseISO8601Duration from "./parseISO8601Duration";

const youtubeApiKey = defineSecret("YOUTUBE_API_KEY");

type YouTubeSearchResponse = {
  items: { id: { videoId: string }; snippet: { title: string } }[];
};

type YouTubeVideoResponse = {
  items: { contentDetails: { duration: string } }[];
};

interface GetYouTubeProps {
  title: string;
  artist: string;
}

export interface YouTubeVideo {
  videoId: string;
  videoTitle: string;
  duration: number;
}

export async function* getYouTube({
  title,
  artist,
}: GetYouTubeProps): AsyncGenerator<YouTubeVideo> {
  // 유튜브 비디오 검색
  const searchResponse = await axios.get<YouTubeSearchResponse>(
    "https://www.googleapis.com/youtube/v3/search",
    {
      params: {
        key: youtubeApiKey.value(),
        part: "id, snippet",
        q: `${artist} ${title} lyrics`,
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

  const videos = searchResponse.data.items.slice(0, 3); // 상위 3개 결과만 고려

  // 유튜브 비디오 길이 조회
  for (const video of videos) {
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;

    const videoResponse = await axios.get<YouTubeVideoResponse>(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          key: youtubeApiKey.value(),
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

    yield { videoId, videoTitle, duration };
  }
}
