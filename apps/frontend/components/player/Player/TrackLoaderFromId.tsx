import useGetTrackFromIdQuery from "@/hooks/queries/useGetTrackFromIdQuery";

import PlayerContent from "./PlayerContent";

interface StreamingQueryProps {
  trackId: string;
}

export default function TrackLoaderFromId({ trackId }: StreamingQueryProps) {
  const { data, error } = useGetTrackFromIdQuery(trackId);

  if (error) throw error;
  if (!data) throw new Error("곡 정보를 불러올 수 없습니다.");

  return (
    <PlayerContent
      track={data.track}
      lyrics={data.lyrics.lyrics}
      lyricsProvider={data.lyricsProvider}
      provider={data.provider}
      trackDetail={data.detail}
    />
  );
}
