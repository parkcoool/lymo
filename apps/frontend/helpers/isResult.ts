import { Result } from "@/apis/addTrack";

export default function isResult(obj: unknown): obj is Result {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "result" in obj &&
    typeof obj.result === "object"
  );
}
