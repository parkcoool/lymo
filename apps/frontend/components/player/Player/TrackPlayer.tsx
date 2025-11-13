import { ProviderDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useLyricsQuery from "@/hooks/queries/useLyricsQuery";
import useTrackDetailQuery from "@/hooks/queries/useTrackDetailQuery";

import PlayerContent from "./PlayerContent";

interface TrackPlayerProps {
  track: TrackDoc;
  trackId: string;
  provider: ProviderDoc;
  providerId: string;
  lyricsProvider: LyricsProvider;
}

export default function TrackPlayer({
  track,
  trackId,
  provider,
  providerId,
  lyricsProvider,
}: TrackPlayerProps) {
  // TODO: 두 suspense query를 별도 컴포넌트로 분리
  const { data: trackDetail, error: trackDetailError } = useTrackDetailQuery(trackId, providerId);
  const { data: lyrics, error: lyricsError } = useLyricsQuery({ trackId, lyricsProvider });

  if (trackDetailError) throw trackDetailError;
  if (lyricsError) throw lyricsError;

  return (
    <PlayerContent track={track} lyrics={lyrics} provider={provider} trackDetail={trackDetail} />
  );
}
