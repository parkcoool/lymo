import { LyricsDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useGenerateDetailQuery from "@/hooks/queries/useGenerateDetailQuery";

import PlayerContent from "./PlayerContent";
import ProvidersQuery from "./ProvidersQuery";

interface StreamingQueryProps {
  track: TrackDoc;
  trackId: string;
  lyrics: LyricsDoc["lyrics"];
  lyricsProvider: LyricsProvider;
}

export default function StreamingQuery({
  track,
  trackId,
  lyrics,
  lyricsProvider,
}: StreamingQueryProps) {
  const { data: generateDetailResult, error } = useGenerateDetailQuery(trackId, lyricsProvider);

  if (error) throw error;

  if (generateDetailResult.exists)
    return (
      <ProvidersQuery
        track={track}
        trackId={trackId}
        lyricsProvider={lyricsProvider}
        providerId={generateDetailResult.providerId}
      />
    );

  return (
    <PlayerContent
      track={track}
      lyrics={lyrics}
      lyricsProvider={lyricsProvider}
      provider={generateDetailResult.provider}
      trackDetail={generateDetailResult.trackDetail}
    />
  );
}
