import { defineSecret } from "firebase-functions/params";
import axios from "axios";
import { z } from "genkit";

import ai from "../core/genkit";

const lastfmApiKey = defineSecret("LASTFM_API_KEY");

export const searchLastfmInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
});

export const searchLastfmOutputSchema = z
  .object({
    title: z.string().describe("The title of the song"),
    artist: z.string().describe("The artist of the song"),
    album: z.string().nullable().describe("The album of the song"),
    coverUrl: z.string().describe("The cover URL of the song"),
    publishedAt: z
      .string()
      .describe("The published date of the song")
      .nullable(),
    summary: z.string().describe("The summary of the song").nullable(),
  })
  .nullable();

type LastfmSearchResponse = {
  track?: {
    name: string;
    artist: {
      name: string;
    };
    album?: {
      title: string;
      image: { "#text": string; size: string }[];
    };
    wiki?: {
      published: string;
      content: string;
    };
  };
};

export const searchLastfm = ai.defineTool(
  {
    name: "searchLastfm",
    inputSchema: searchLastfmInputSchema,
    outputSchema: searchLastfmOutputSchema,
    description:
      "Fetch the official title, artist, album, cover URL, published date and summary of a song given its title and artist from Last.fm",
  },
  async ({ title, artist }) => {
    const response = await axios.get<LastfmSearchResponse>(
      "https://ws.audioscrobbler.com/2.0/?method=track.getInfo",
      {
        params: {
          api_key: lastfmApiKey.value(),
          track: title,
          artist,
          format: "json",
        },
      }
    );

    if (response.status !== 200)
      throw new Error("Failed to fetch lyrics from Last.fm");

    const track = response.data.track;
    if (!track) {
      return null;
    }

    const coverUrl =
      track.album?.image.find((img) => img.size === "extralarge")?.["#text"] ??
      "";
    const publishedAt = track.wiki?.published || null;
    let summary = track.wiki?.content || null;
    if (summary) {
      summary = summary.replace(/<[^>]+>/g, "");
      summary = summary.replace(/\s+/g, " ").trim();
    }

    return {
      title: track.name,
      artist: track.artist.name,
      album: track.album?.title ?? null,
      coverUrl,
      publishedAt,
      summary,
    };
  }
);
