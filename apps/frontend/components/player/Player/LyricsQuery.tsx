import { ProviderDoc, TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useLyricsQuery from "@/hooks/queries/useLyricsQuery";

import PlayerContent from "./PlayerContent";
import StreamingQuery from "./StreamingQuery";

interface LyricsQueryProps {
  track: TrackDoc;
  trackId: string;
  provider?: ProviderDoc;
  trackDetail?: TrackDetailDoc;
  lyricsProvider: LyricsProvider;
}

export default function LyricsQuery({
  track,
  trackId,
  provider,
  trackDetail,
  lyricsProvider,
}: LyricsQueryProps) {
  const { data: lyrics, error } = useLyricsQuery({ trackId, lyricsProvider });

  if (error) throw error;

  if (trackDetail && provider)
    return (
      <PlayerContent track={track} lyrics={lyrics} provider={provider} trackDetail={trackDetail} />
    );
  else
    return (
      <StreamingQuery
        track={track}
        trackId={trackId}
        lyrics={lyrics}
        lyricsProvider={lyricsProvider}
      />
    );
}
