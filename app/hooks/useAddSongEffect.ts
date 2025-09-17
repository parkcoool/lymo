import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";

import addSong, { type AddSongStream } from "~/apis/addSong";
import useFetchingSongStore from "~/contexts/useFetchingSongStore";
import usePlayingSongStore from "~/contexts/usePlayingSongStore";
import type { Song } from "~/types/song";

export default function useAddSongEffect(
  title: string,
  artist: string,
  initialData?: Partial<Song>
) {
  const { setSong, setPlayerState } = usePlayingSongStore();
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const { data: song, isFetched } = useQuery({
    queryKey: ["song", { title, artist }],
    queryFn: streamedQuery<AddSongStream, Partial<Song>>({
      streamFn: () => addSong({ title, artist }),
      initialValue: initialData ?? {},
      reducer: (_, songChunk) => ({
        ...initialData,
        title: songChunk.title,
        artist: songChunk.artist,
        album: songChunk.album,
        coverUrl: songChunk.coverUrl,
        publishedAt: songChunk.publishedAt,
        summary: songChunk.summary,
        lyrics: songChunk.lyrics?.map((paragraph) => ({
          ...paragraph,
          summary: paragraph.summary ?? null,
          sentences: paragraph.sentences.map((sentence) => ({
            ...sentence,
            translation: sentence.translation ?? null,
          })),
        })),
      }),
    }),
    initialData: initialData ?? {},
  });

  useEffect(() => {
    if (song !== undefined) {
      setSong(song);
    }

    if (!isFetched) {
      setPlayerState("fetching");
      return;
    }

    setPlayerState("ready");
    setSong(song);
    setFetchingSong({ fetchType: "none" });
  }, [song, isFetched]);
}
