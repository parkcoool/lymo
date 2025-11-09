import { Result } from "@/apis/addTrack";

export default function isResult(obj: any): obj is Result {
  return typeof obj === "object" && typeof obj.result === "object";
}
