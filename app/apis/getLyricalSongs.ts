import api from "~/apis";

interface GetLyricalSongsProps {
  page?: number;
}

export interface GetLyricalSongsResponse {
  songs: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    lyricsPreview: string;
  }[];
}

export default async function getLyricalSongs({
  page = 0,
}: GetLyricalSongsProps) {
  return await api.get<GetLyricalSongsResponse>("/song/lyrical", {
    params: { page },
  });
}
