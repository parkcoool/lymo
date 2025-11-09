import type { Track, TrackDetail } from "@lymo/schemas/shared";

import type { Result } from "@/apis/addTrack";
import getTrack from "@/apis/getTrack";

export default async function processResult(
  track: Track & TrackDetail,
  result: Result
) {
  const { duplicate, notFound, id } = result.result;
  console.log("[RESULT]", result.result);

  if (duplicate && id) {
    const newTrack = await getTrack({ trackId: id });
    Object.assign(track, newTrack);
  } else if (notFound) {
    throw new Error("곡을 찾을 수 없습니다.");
  } else if (id) {
    track.id = id;
  }
}
