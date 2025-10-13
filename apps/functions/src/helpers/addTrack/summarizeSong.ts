import { StreamingCallback } from "genkit";

import { SummaryAppendEvent } from "@lymo/schemas/event";

import { summarizeSongFlow } from "../../flows/summarizeSong.flow";
import type { LRCLIBResult } from "../../types/lrclib";
import type { SpotifyResult } from "../../types/spotify";

export default async function summarizeSong(
  sendChunk: StreamingCallback<SummaryAppendEvent>,
  spotifyResult: SpotifyResult,
  lrclibResult: LRCLIBResult
) {
  const { stream: summarizeSongStream, output: summarizeSongOutput } =
    summarizeSongFlow.stream({
      title: spotifyResult.title,
      artist: spotifyResult.artist.join(", "),
      album: spotifyResult.album,
      lyrics: lrclibResult.lyrics.map((line) => line.text),
    });

  // summarizeSongStream 처리
  for await (const chunk of summarizeSongStream) {
    sendChunk(chunk);
  }

  // summarizeSongOutput 처리
  return await summarizeSongOutput;
}
