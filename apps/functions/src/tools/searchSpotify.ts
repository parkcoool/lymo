import { z } from "genkit";

import ai from "@/core/genkit";
import spotify from "@/core/spotify";
import calculateSimilarity from "@/utils/calculateSimilarity";

export const SearchSpotifyInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  duration: z.number().describe("The duration of the song in seconds"),
});

export const SearchSpotifyOutputSchema = z
  .object({
    id: z.string().describe("The ID of the song"),
    title: z.string().describe("The title of the song"),
    artist: z.array(z.string()).describe("The artists of the song"),
    album: z.string().nullable().describe("The album of the song"),
    coverUrl: z.string().describe("The cover URL of the song"),
    publishedAt: z.string().describe("The published date of the song").nullable(),
    duration: z.number().describe("The duration of the song in seconds"),
  })
  .nullable();

export const searchSpotify = ai.defineTool(
  {
    name: "searchSpotify",
    inputSchema: SearchSpotifyInputSchema,
    outputSchema: SearchSpotifyOutputSchema,
    description:
      "Fetch the official title, artist, album, cover URL, published date and summary of a song given its title and artist from Spotify",
  },
  async ({ title, artist, duration }) => {
    const credentialsResponse = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(credentialsResponse.body["access_token"]);

    const tracksResponse = await spotify.searchTracks(`${title} ${artist}`, {
      market: "KR",
    });
    const tracks = tracksResponse.body.tracks?.items;
    if (!tracks || tracks.length === 0) return null;

    let mostAccurateTrack: SpotifyApi.TrackObjectFull = tracks[0];
    let highestScore = -1;
    for (const track of tracks) {
      const score = getAccurationScore(track, { title, artist, duration });
      if (score > highestScore) {
        highestScore = score;
        mostAccurateTrack = track;
      }
    }

    return {
      id: mostAccurateTrack.id,
      title: mostAccurateTrack.name,
      artist: mostAccurateTrack.artists.map((a) => a.name),
      album: mostAccurateTrack.album.name || null,
      coverUrl: mostAccurateTrack.album.images[0]?.url || "",
      publishedAt: mostAccurateTrack.album.release_date || null,
      duration: Math.floor(mostAccurateTrack.duration_ms / 1000),
    };
  }
);

const SCORE_WEIGHTS = {
  title: 0.3,
  artist: 0.2,
  duration: 0.5,
};

function getAccurationScore(
  track: SpotifyApi.TrackObjectFull,
  query: { title: string; artist: string; duration: number }
): number {
  // 1. 제목
  const title = track.name.toLowerCase().replace(/\(.*?\)/g, "");
  const titleScore = calculateSimilarity(title, query.title.toLowerCase());

  // 2. 아티스트 점수
  const artistScores = track.artists.map((artist) =>
    calculateSimilarity(artist.name.toLowerCase(), query.artist.toLowerCase())
  );
  const artistScore = Math.max(...artistScores);

  // 3. 재생 시간 점수
  const durationScore = Math.max(
    0,
    1 - Math.abs(track.duration_ms / 1000 - query.duration) / query.duration
  );

  // 4. 가중치를 적용하여 최종 점수 계산
  const finalScore =
    titleScore * SCORE_WEIGHTS.title +
    artistScore * SCORE_WEIGHTS.artist +
    durationScore * SCORE_WEIGHTS.duration;

  return finalScore;
}
