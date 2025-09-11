import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import getSong from "~/apis/getSong";
import usePlayerStore from "~/contexts/usePlayerStore";
import type { Song } from "~/types/song";

export default function usePlaySongEffect(songId: string) {
  const { setSong } = usePlayerStore();

  const { data: song, isFetched } = useSuspenseQuery({
    queryKey: ["song", songId],
    queryFn: () => getSong({ songId }),
    select: (res) => res.data.song,
  });

  // 노래 데이터가 로드 완료됐을 시
  useEffect(() => {
    if (!isFetched || !song) return;
    setSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      coverUrl: song.coverUrl,
    });
  }, [isFetched]);

  return song as Song;
}
