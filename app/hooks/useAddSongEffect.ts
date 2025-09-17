import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";

import addSong from "~/apis/addSong";
import useFetchingSongStore from "~/contexts/useFetchingSongStore";
import usePlayingSongStore from "~/contexts/usePlayingSongStore";
import type { Song } from "~/types/song";

export default function useAddSongEffect(
  title: string,
  artist: string,
  initialData?: Partial<Song>
) {
  const navigate = useNavigate();
  const { setSong, setPlayerState } = usePlayingSongStore();
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const { data: song, isFetched } = useQuery({
    queryKey: ["song", { title, artist }],
    queryFn: streamedQuery({
      streamFn: () => addSong({ title, artist }),
      reducer: (acc, chunk) => ({
        ...acc,
        ...chunk,
        lyrics: chunk.lyrics?.map((paragraph) => ({
          ...paragraph,
          summary: paragraph.summary ?? null,
          sentences: paragraph.sentences.map((sentence) => ({
            ...sentence,
            translation: sentence.translation ?? null,
          })),
        })),
      }),
      initialValue: initialData ?? {},
    }),
  });

  useEffect(() => {
    if (song === undefined) return;

    setSong(song);
    navigate(`/player`);

    if (!isFetched) {
      setPlayerState("fetching");
      return;
    }

    setPlayerState("ready");
    setFetchingSong({ fetchType: "none" });
  }, [song, isFetched]);
}
