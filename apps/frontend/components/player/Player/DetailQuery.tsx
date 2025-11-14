import { ProviderDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackDetailQuery from "@/hooks/queries/useTrackDetailQuery";

import LyricsQuery from "./LyricsQuery";

interface DetailQueryProps {
  track: TrackDoc;
  trackId: string;
  provider: ProviderDoc;
  providerId: string;
  lyricsProvider: LyricsProvider;
}

export default function DetailQuery({
  track,
  trackId,
  provider,
  providerId,
  lyricsProvider,
}: DetailQueryProps) {
  const { setting } = useSettingStore();

  const { data: trackDetail, error: trackDetailError } = useTrackDetailQuery({
    trackId,
    providerId,
    language: setting.defaultLanguage,
  });

  if (trackDetailError) throw trackDetailError;
  if (!trackDetail) throw new Error("곡 상세 정보를 찾을 수 없습니다.");

  return (
    <LyricsQuery
      track={track}
      trackId={trackId}
      provider={provider}
      trackDetail={trackDetail}
      lyricsProvider={lyricsProvider}
    />
  );
}
