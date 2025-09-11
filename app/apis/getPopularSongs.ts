import api from "~/apis";

interface GetPopularSongsProps {
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
}: GetPopularSongsProps) {
  return await api.get<GetPopularSongsResponse>("/song/popular", {
    params: { page },
  });
}
