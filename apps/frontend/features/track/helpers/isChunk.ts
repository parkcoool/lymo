import { Chunk } from "@/features/track/apis/addTrack";

export default function isChunk(obj: any): obj is Chunk {
  return (
    typeof obj === "object" &&
    typeof obj.message === "object" &&
    typeof obj.message.event === "string" &&
    typeof obj.message.data === "object"
  );
}
