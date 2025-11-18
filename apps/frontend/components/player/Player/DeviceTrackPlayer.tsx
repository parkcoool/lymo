import useAddTrackQuery from "@/hooks/queries/useAddTrackQuery";

import StreamingQuery from "./StreamingQuery";

interface DeviceTrackPlayerProps {
  title: string;
  artist: string;
  duration: number;
}

export default function DeviceTrackPlayer({ title, artist, duration }: DeviceTrackPlayerProps) {
  const { data: addTrackResult, error: addTrackError } = useAddTrackQuery({
    title,
    artist,
    duration,
  });

  if (addTrackError) throw addTrackError;

  return (
    <StreamingQuery
      track={addTrackResult.track}
      trackId={addTrackResult.id}
      lyricsProvider={addTrackResult.lyricsProvider}
      lyrics={addTrackResult.lyrics}
    />
  );
}
