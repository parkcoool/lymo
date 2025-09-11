import api from "~/apis";

interface getPopularSongsProps {
  page?: number;
}

export interface GetPopularSongsResponse {
  songs: {
    id: string;
    title: string;
    coverUrl: string;
  }[];
}

export default async function getPopularSongs({
  page = 0,
}: getPopularSongsProps) {
  return await api.get<GetPopularSongsResponse>("/song/popular", {
    params: { page },
  });
}
