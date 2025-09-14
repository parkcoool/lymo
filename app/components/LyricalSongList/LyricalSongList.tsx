import { useSuspenseQuery } from "@tanstack/react-query";

import { LyricalSong } from "~/components/Song";

export default function LyricalSongList() {
  const { data: lyricalSongs } = useSuspenseQuery({
    queryKey: ["lyricalSongs"],
    queryFn: async () => [
      {
        id: "1",
        title: "Song with Lyrics 1",
        artist: "Artist A",
        coverUrl: "https://placehold.co/200",
        lyricsPreview: "These are the lyrics of song 1...",
      },
    ],
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
