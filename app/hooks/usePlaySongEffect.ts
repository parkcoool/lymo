import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import getSong from "~/apis/getSong";
import usePlayerStore from "~/contexts/usePlayerStore";

export default function usePlaySongEffect(songId: string) {
  const { setSong, playPause } = usePlayerStore();

  const { data: song, isFetched } = useQuery({
    queryKey: ["song", songId],
    queryFn: () => getSong({ songId }),
  });

  // 노래 데이터가 로드 완료됐을 시
  useEffect(() => {
    if (!isFetched || !song) return;

    setSong(
      {
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        coverUrl: song.coverUrl,
      },
      song.sourceProvider,
      song.sourceId
    );
    playPause(true);
  }, [isFetched]);

  return song;
}
