import { useSuspenseQuery } from "@tanstack/react-query";

import getPopularSongs from "~/apis/getPopularSongs";
import { CompactSong } from "~/components/Song";

export default function PopularSongList() {
  const { data: popularSongs } = useSuspenseQuery({
    queryKey: ["popularSongs"],
    queryFn: async () => getPopularSongs({}),
  });

  return (
    <>
      {popularSongs?.map((song) => (
        <CompactSong
          key={song.id}
          id={song.id}
          title={song.title}
          coverUrl={song.coverUrl}
        />
      ))}
    </>
  );
}
