import { LyricsDoc, ProviderDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import useGenerateDetailQuery from "@/hooks/queries/useGenerateDetailQuery";

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
  if (generateDetailResult.exists) throw new Error("곡 상세 정보가 이미 존재합니다.");
  return (
    <PlayerContent
      track={track}
      lyrics={lyrics}
      provider={generateDetailResult.provider}
      trackDetail={generateDetailResult.trackDetail}
    />
  );
}
