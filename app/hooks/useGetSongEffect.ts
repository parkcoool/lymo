import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import getSong from "~/apis/getSong";
import useFetchingSongStore from "~/contexts/useFetchingSongStore";
import usePlayingSongStore from "~/contexts/usePlayingSongStore";
import type { Song } from "~/types/song";

export default function useGetSong(
  songId: string,
  initialData?: Partial<Song>
) {
  const { setSong, setPlayerState } = usePlayingSongStore();
  const setFetchingSong = useFetchingSongStore(
    (state) => state.setFetchingSong
  );

  const { data: song, isFetched } = useQuery({
    queryKey: ["song", songId],
    queryFn: () => getSong({ songId }),
    select: (song) => ({ ...initialData, ...song }),
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
