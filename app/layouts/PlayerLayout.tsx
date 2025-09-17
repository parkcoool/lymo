import { Outlet } from "react-router";

import YouTubePlayer from "~/components/YouTubePlayer/YouTubePlayer";
import useFetchingSongStore from "~/contexts/useFetchingSongStore";
import useAddSongEffect from "~/hooks/useAddSongEffect";
import useGetSongEffect from "~/hooks/useGetSongEffect";
import type { Song } from "~/types/song";

export default function PlayerLayout() {
  const fetchingSongStore = useFetchingSongStore();

  return (
    <>
      {fetchingSongStore.fetchType === "get" && (
        <GetSong
          songId={fetchingSongStore.id}
          initialData={fetchingSongStore.initialData}
        />
      )}
      {fetchingSongStore.fetchType === "add" && (
        <AddSong
          title={fetchingSongStore.title}
          artist={fetchingSongStore.artist}
          initialData={fetchingSongStore.initialData}
        />
      )}
      <Outlet />
      <YouTubePlayer />
    </>
  );
}

interface GetSongProps {
  songId: string;
  initialData?: Partial<Song>;
}

function GetSong({ songId, initialData }: GetSongProps) {
  useGetSongEffect(songId, initialData);
  return <></>;
}

interface AddSongProps {
  title: string;
  artist: string;
  initialData?: Partial<Song>;
}

function AddSong({ title, artist, initialData }: AddSongProps) {
  useAddSongEffect(title, artist, initialData);
  return <></>;
}
