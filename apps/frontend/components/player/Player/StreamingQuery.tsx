import { LyricsDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useGenerateDetailQuery from "@/hooks/queries/useGetTrackFromIdQuery";

import PlayerContent from "./PlayerContent";

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
  if (!generateDetailResult) throw new Error("곡 상세 정보를 불러올 수 없습니다.");

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
