import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import getSong from "~/apis/getSong";
import usePlayerStore from "~/contexts/usePlayerStore";

export default function usePlaySongEffect(songId: string) {
  const { player, song, setSong, setTime } = usePlayerStore();

  const { data: newSong, isFetched } = useQuery({
    queryKey: ["song", songId],
    queryFn: () => getSong({ songId }),
  });

  // 노래 데이터가 로드 완료됐을 시
  useEffect(() => {
    if (song?.id !== songId) {
      setTime(0);
    }

    if (!isFetched || !newSong) return;

    setSong(
      {
        id: newSong.id,
        title: newSong.title,
        artist: newSong.artist,
        duration: newSong.duration,
        coverUrl: newSong.coverUrl,
      },
      newSong.sourceProvider,
      newSong.sourceId
    );
  }, [isFetched]);

  return newSong;
}
