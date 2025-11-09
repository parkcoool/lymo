import { fetch } from "expo/fetch";
import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

import isChunk from "@/helpers/isChunk";
import isResult from "@/helpers/isResult";
import processChunk from "@/helpers/processChunk";
import processResult from "@/helpers/processResult";

export type Chunk = { message: AddTrackFlowStream };
export type Result = { result: AddTrackFlowOutput };

export interface ProcessChunkState {
  isLyricsGrouped: boolean;
}

export default async function* addTrack(
  { title, artist, duration }: AddTrackFlowInput,
  signal?: AbortSignal
): AsyncGenerator<Track & TrackDetail> {
  const resp = await fetch("https://addtrack-au5g5tbwtq-du.a.run.app", {
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ data: { title, artist, duration } }),
    signal,
  });
  const reader = resp.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  const track: Track & TrackDetail = {
    id: "",
    title,
    artist,
    album: null,
    coverUrl: "",
    publishedAt: null,
    duration,
    lyrics: [],
    lyricsProvider: "",
    summary: "",
  };

  const state: ProcessChunkState = {
    isLyricsGrouped: false,
  };

  console.log("[START]", { title, artist, duration });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // "data: { ... }"의 형태로 수신됨
    // 위 형태가 반복되어 나타날 수 있음
    const rawString = decoder.decode(value, { stream: true });
    const lines = rawString.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const jsonString = line.replaceAll("data: ", "").trim();
      let obj: any;

      try {
        obj = JSON.parse(jsonString);
      } catch (e) {
        console.error("Failed to parse JSON:", jsonString, e);
        continue; // Skip this line and continue with the next
      }

      if (isChunk(obj)) {
        processChunk(track, state, obj);
      } else if (isResult(obj)) {
        await processResult(track, obj);
      } else {
        console.error("Invalid chunk format: " + jsonString);
      }

      // TODO: 알고리즘 개선
      yield JSON.parse(JSON.stringify(track));
    }
  }
}
