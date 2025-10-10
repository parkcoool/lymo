import { z } from "genkit";

import ai from "../core/genkit";
import spotify from "../core/spotify";

export const SearchSpotifyInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const SearchSpotifyOutputSchema = z
  .object({
    id: z.string().describe("The ID of the song"),
    title: z.string().describe("The title of the song"),
    artist: z.array(z.string()).describe("The artists of the song"),
    album: z.string().nullable().describe("The album of the song"),
    coverUrl: z.string().describe("The cover URL of the song"),
    publishedAt: z
      .string()
      .describe("The published date of the song")
      .nullable(),
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
  async ({ title, artist }) => {
    const credentialsResponse = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(credentialsResponse.body["access_token"]);

    const tracksResponse = await spotify.searchTracks(`${title} ${artist}`, {
      market: "KR",
    });
    const tracks = tracksResponse.body.tracks?.items;
    if (!tracks || tracks.length === 0) return null;

    const mostPopularTrack = tracks.reduce((prev, current) =>
      prev.popularity > current.popularity ? prev : current
    );

    return {
      id: mostPopularTrack.id,
      title: mostPopularTrack.name,
      artist: mostPopularTrack.artists.map((a) => a.name),
      album: mostPopularTrack.album.name || null,
      coverUrl: mostPopularTrack.album.images[0]?.url || "",
      publishedAt: mostPopularTrack.album.release_date || null,
      duration: Math.floor(mostPopularTrack.duration_ms / 1000),
    };
  }
);
