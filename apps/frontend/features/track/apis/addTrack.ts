import { fetch } from "expo/fetch";

import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";

type Chunk = { message: AddTrackFlowStream };
type Result = { result: AddTrackFlowOutput };

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
    body: JSON.stringify({ data: { title, artist, duration } }),
  });
  const reader = resp.body?.getReader();
  const decoder = new TextDecoder("utf-8");

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

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
      console.log("new chunk:" + JSON.stringify(jsonString));
      const obj = JSON.parse(jsonString);

      if (isChunk(obj)) {
        yield { type: "chunk", data: obj.message } as const;
      } else if (isResult(obj)) {
        yield { type: "result", data: obj.result } as const;
      } else {
        throw new Error("Invalid chunk format: " + jsonString);
      }
    }
  }
}

function isChunk(obj: any): obj is Chunk {
  return (
    typeof obj === "object" &&
    typeof obj.message === "object" &&
    typeof obj.message.event === "string" &&
    typeof obj.message.data === "object"
  );
}

function isResult(obj: any): obj is Result {
  return (
    typeof obj === "object" &&
    (typeof obj.result === "string" || obj.result === null)
  );
}
