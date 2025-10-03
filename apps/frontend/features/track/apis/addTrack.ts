import { fetch } from "expo/fetch";

import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";

export default async function* addTrack({
  title,
  artist,
  duration,
}: AddTrackFlowInput) {
  const resp = await fetch("", {
    headers: { Accept: "text/event-stream" },
  });
  const reader = resp.body?.getReader();

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    yield value;
  }
}
