import api from "~/apis";

interface GetSongOverviewProps {
  songId: string;
}

export interface GetSongOverviewResponse {
  overview: string;
}

export default async function getSongOverview({
  songId,
}: GetSongOverviewProps) {
  return await api.get<GetSongOverviewResponse>("/song/overview", {
    params: { songId },
  });
}
