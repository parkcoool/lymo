import { httpsCallable } from "firebase/functions";
import type {
  AddTrackFlowInput,
  AddTrackFlowStream,
  AddTrackFlowOutput,
} from "@lymo/schemas/function";

import { functions } from "@/core/firebase";

export default async function* addTrack({
  title,
  artist,
  duration,
}: AddTrackFlowInput) {
  const addSongFlow = httpsCallable<
    AddTrackFlowInput,
    AddTrackFlowOutput,
    AddTrackFlowStream
  >(functions, "addTrack");

  const { data, stream } = await addSongFlow.stream({
    title,
    artist,
    duration,
  });

  for await (const chunk of stream) {
    yield chunk;
  }

  return await data;
}
