import { fetch } from "expo/fetch";

import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";

type Chunk = { data: AddTrackFlowStream | { result: AddTrackFlowOutput } };

export default async function* addTrack({
  title,
  artist,
  duration,
}: AddTrackFlowInput) {
  const resp = await fetch("https://addtrack-au5g5tbwtq-du.a.run.app", {
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ title, artist, duration }),
  });
  const reader = resp.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = JSON.parse(decoder.decode(value));
    if (!isChunk(chunk))
      throw new Error("Invalid chunk format received from server");
    yield chunk.data;
  }
}

function isChunk(obj: any): obj is Chunk {
  return obj && typeof obj === "object" && "data" in obj;
}
