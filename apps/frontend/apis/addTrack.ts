import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";
import type { Track, TrackDetail } from "@lymo/schemas/shared";
import { fetch } from "expo/fetch";

import isChunk from "@/helpers/isChunk";
import isResult from "@/helpers/isResult";
import processChunk from "@/helpers/processChunk";
import processResult from "@/helpers/processResult";

export type Chunk = { message: AddTrackFlowStream };
export type Result = { result: AddTrackFlowOutput };

export interface ProcessChunkState {
  isLyricsGrouped: boolean;
}

export default async function* addTrack({
  title,
  artist,
  duration,
}: AddTrackFlowInput): AsyncGenerator<Track & TrackDetail> {
  const resp = await fetch("https://addtrack-au5g5tbwtq-du.a.run.app", {
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ data: { title, artist, duration } }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch track: ${resp.status} ${resp.statusText}`);
  }

  const reader = resp.body?.getReader();

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  const decoder = new TextDecoder("utf-8");

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
      let obj: unknown;

      try {
        obj = JSON.parse(jsonString);
      } catch (e) {
        console.error("[PARSE_ERROR]", {
          error: e instanceof Error ? e.message : String(e),
          jsonString,
        });
        continue;
      }

      if (isChunk(obj)) {
        processChunk(track, state, obj);
      } else if (isResult(obj)) {
        await processResult(track, obj);
      } else {
        console.error("[INVALID_FORMAT]", { jsonString, obj });
      }

      // Deep clone을 통해 불변성 보장
      yield structuredClone(track);
    }
  }
}
