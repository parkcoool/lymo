import { httpsCallable } from "firebase/functions";

import { functions } from "~/core/firebase";

interface AddSongProps {
  title: string;
  artist: string;
}

type AddSongResponse = number | null;

export interface AddSongStream {
  title?: string;
  artist?: string;
  album?: string | null;
  coverUrl?: string | null;
  publishedAt?: string | null;
  summary?: string | null;
  lyrics?: {
    summary?: string | null;
    sentences: {
      start: number;
      end: number;
      text: string;
      translation?: string | null;
    }[];
  }[];
}

export default async function* addSong({ title, artist }: AddSongProps) {
  const addSongFlow = httpsCallable<
    AddSongProps,
    AddSongResponse,
    AddSongStream
  >(functions, "addSong");

  const { data, stream } = await addSongFlow.stream({ title, artist });

  for await (const chunk of stream) {
    yield chunk;
  }

  return await data;
}
