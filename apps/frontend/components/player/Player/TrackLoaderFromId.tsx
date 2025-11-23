import useGetTrackFromIdQuery from "@/hooks/queries/useGetTrackFromIdQuery";

import PlayerContent from "./PlayerContent";

interface StreamingQueryProps {
  trackId: string;
}

export default function TrackLoaderFromId({ trackId }: StreamingQueryProps) {
  const { data, error } = useGetTrackFromIdQuery(trackId);

  if (error) throw error;
  if (!data) return null;
  return <PlayerContent {...data} />;
}
