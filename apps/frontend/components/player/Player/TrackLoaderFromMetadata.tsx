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
  if (!data) return null;
  return <PlayerContent {...data} />;
}
