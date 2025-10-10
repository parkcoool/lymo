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

    return {
      id: tracks[0].id,
      title: tracks[0].name,
      artist: tracks[0].artists.map((a) => a.name),
      album: tracks[0].album.name || null,
      coverUrl: tracks[0].album.images[0]?.url || "",
      publishedAt: tracks[0].album.release_date || null,
      duration: Math.floor(tracks[0].duration_ms / 1000),
    };
  }
);
