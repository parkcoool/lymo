import api from "~/apis";

interface GetSongProps {
  songId: string;
}

export interface GetSongResponse {
  song: {
    id: string;
    title: string;
    artist: string;
    album: string | null;
    duration: number;
    lyricsProvider: "LRCLib" | null;
    lyricsId: string | null;
    sourceProvider: "YouTube";
    sourceId: string;
    coverUrl: string;
    createdAt: string;
  };
}

export default async function getSong({ songId }: GetSongProps) {
  return await api.get<GetSongResponse>("/song", {
    params: { songId },
  });
}
