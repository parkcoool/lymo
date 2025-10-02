import { httpsCallable } from "firebase/functions";
import { addSong as addSongType } from "@lymo/schemas/functions";

import { functions } from "@/core/firebase";

type AddSongStream = addSongType.AddSongStream;

type AddSongOutput = number | null;

interface AddTrackProps {
  title: string;
  artist: string;
}

export default async function* addTrack({ title, artist }: AddTrackProps) {
  const addSongFlow = httpsCallable<
    AddTrackProps,
    AddSongOutput,
    AddSongStream
  >(functions, "addTrack");

  const { data, stream } = await addSongFlow.stream({ title, artist });

  for await (const chunk of stream) {
    yield chunk;
  }

  return await data;
}
