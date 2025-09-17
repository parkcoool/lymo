import { httpsCallable } from "firebase/functions";

import { functions } from "~/core/firebase";

interface AddSongProps {
  title: string;
  artist: string;
}

type AddSongResponse = number | null;

interface AddSongStream {
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
  publishedAt?: string;
  summary?: string;
  lyrics?: {
    summary?: string | null;
    sentences: { text: string; translation?: string | null }[];
  }[];
}

export default async function* addSong({ title, artist }: AddSongProps) {
  const addSongFlow = httpsCallable<
    AddSongProps,
    AddSongResponse,
    AddSongStream
  >(functions, "addSong");

  const { data, stream } = await addSongFlow.stream({ title, artist });

  yield* stream;
  return await data;
}
