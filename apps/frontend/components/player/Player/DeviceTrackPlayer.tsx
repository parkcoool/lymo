import useAddTrackQuery from "@/hooks/queries/useAddTrackQuery";
import useGenerateDetailQuery from "@/hooks/queries/useGenerateDetailQuery";

import PlayerContent from "./PlayerContent";
import ProvidersQuery from "./ProvidersQuery";

interface DeviceTrackPlayerProps {
  title: string;
  artist: string;
  duration: number;
}

export default function DeviceTrackPlayer({ title, artist, duration }: DeviceTrackPlayerProps) {
  // TODO: 두 suspense query를 별도 컴포넌트로 분리
  const { data: addTrackResult, error: addTrackError } = useAddTrackQuery({
    title,
    artist,
    duration,
  });
  const { data: generateDetailResult, error: generateDetailError } = useGenerateDetailQuery(
    addTrackResult.id,
    addTrackResult.lyricsProvider
  );

  if (addTrackError) throw addTrackError;
  if (generateDetailError) throw generateDetailError;

  if (generateDetailResult.exists)
    return (
      <ProvidersQuery
        track={addTrackResult.track}
        trackId={addTrackResult.id}
        lyricsProvider={addTrackResult.lyricsProvider}
        providerId={generateDetailResult.providerId}
      />
    );
  else
    return (
      <PlayerContent
        track={addTrackResult.track}
        lyrics={addTrackResult.lyrics}
        provider={generateDetailResult.provider}
        trackDetail={generateDetailResult.trackDetail}
      />
    );
}
