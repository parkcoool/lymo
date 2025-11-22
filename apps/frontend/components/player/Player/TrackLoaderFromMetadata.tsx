import useGetTrackFromMetadataQuery from "@/hooks/queries/useGetTrackFromMetadataQuery";

import PlayerContent from "./PlayerContent";

interface TrackLoaderFromMetadataProps {
  title: string;
  artist: string;
  durationInSeconds: number;
}

export default function TrackLoaderFromMetadata({
  title,
  artist,
  durationInSeconds,
}: TrackLoaderFromMetadataProps) {
  const { data, error } = useGetTrackFromMetadataQuery({ title, artist, durationInSeconds });

  if (error) throw error;

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
