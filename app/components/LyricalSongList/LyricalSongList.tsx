import { useSuspenseQuery } from "@tanstack/react-query";

import getLyricalSongs from "~/apis/getLyricalSongs";
import { LyricalSong } from "~/components/Song";

export default function LyricalSongList() {
  const { data: lyricalSongs } = useSuspenseQuery({
    queryKey: ["lyricalSongs"],
    queryFn: async () => getLyricalSongs({}),
    select: (data) => data.data.songs,
  });

  return (
    <>
      {lyricalSongs?.map((song) => (
        <LyricalSong
          key={song.id}
          id={song.id}
          title={song.title}
          artist={song.artist}
          coverUrl={song.coverUrl}
          lyrics={song.lyricsPreview}
        />
      ))}
    </>
  );
}
