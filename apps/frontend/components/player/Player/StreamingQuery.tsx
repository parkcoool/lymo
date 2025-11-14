import { ProviderDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useGenerateDetailQuery from "@/hooks/queries/useGenerateDetailQuery";
import useLyricsQuery from "@/hooks/queries/useLyricsQuery";

import PlayerContent from "./PlayerContent";

interface StreamingQueryProps {
  track: TrackDoc;
  trackId: string;
  provider: ProviderDoc;
  lyricsProvider: LyricsProvider;
}

export default function StreamingQuery({
  track,
  trackId,
  provider,
  lyricsProvider,
}: StreamingQueryProps) {
  // TODO: 두 suspense query를 별도 컴포넌트로 분리
  const { data: lyrics, error: lyricsError } = useLyricsQuery({ trackId, lyricsProvider });
  const { data: generateDetailResult, error: generateDetailError } = useGenerateDetailQuery(
    trackId,
    lyricsProvider
  );

  if (generateDetailError) throw generateDetailError;
  if (lyricsError) throw lyricsError;

  return (
    <PlayerContent
      track={track}
      lyrics={lyrics}
      provider={provider}
      trackDetail={generateDetailResult.trackDetail}
    />
  );
}
