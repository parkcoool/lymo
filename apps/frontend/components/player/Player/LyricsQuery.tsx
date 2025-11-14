import { ProviderDoc, TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useLyricsQuery from "@/hooks/queries/useLyricsQuery";

import PlayerContent from "./PlayerContent";

interface LyricsQueryProps {
  track: TrackDoc;
  trackId: string;
  provider: ProviderDoc;
  trackDetail: TrackDetailDoc;
  lyricsProvider: LyricsProvider;
}

export default function LyricsQuery({
  track,
  trackId,
  provider,
  trackDetail,
  lyricsProvider,
}: LyricsQueryProps) {
  // TODO: 두 suspense query를 별도 컴포넌트로 분리
  const { data: lyrics, error: lyricsError } = useLyricsQuery({ trackId, lyricsProvider });

  if (lyricsError) throw lyricsError;

  return (
    <PlayerContent track={track} lyrics={lyrics} provider={provider} trackDetail={trackDetail} />
  );
}
