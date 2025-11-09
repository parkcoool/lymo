import { Chunk } from "@/apis/addTrack";

export default function isChunk(obj: unknown): obj is Chunk {
  return (
    obj != null &&
    typeof obj === "object" &&
    "message" in obj &&
    obj.message != null &&
    typeof obj.message === "object" &&
    "event" in obj.message &&
    typeof obj.message.event === "string" &&
    "data" in obj.message &&
    typeof obj.message.data === "object"
  );
}
