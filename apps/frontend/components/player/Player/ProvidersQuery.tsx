import { TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

import { useSettingStore } from "@/contexts/useSettingStore";
import useProvidersQuery from "@/hooks/queries/useProvidersQuery";

import DetailQuery from "./DetailQuery";
import LyricsQuery from "./LyricsQuery";

interface ProvidersQueryProps {
  track: TrackDoc;
  trackId: string;
  trackDetail?: TrackDetailDoc;
  lyricsProvider: LyricsProvider;
  providerId?: string;
}

export default function ProvidersQuery({
  track,
  trackId,
  trackDetail,
  lyricsProvider,
  providerId,
}: ProvidersQueryProps) {
  const { setting } = useSettingStore();
  const { data: providers, error } = useProvidersQuery({ trackId });

  if (error) throw error;

  if (providers.length === 0)
    return (
      <LyricsQuery
        track={track}
        trackId={trackId}
        trackDetail={trackDetail}
        lyricsProvider={lyricsProvider}
      />
    );

  // 우선순위에 따라 provider 결정
  const provider =
    providers.find((p) => p.id === providerId) ??
    providers.find((p) => p.id === setting.defaultLLMModel) ??
    providers[0];

  return (
    <DetailQuery
      track={track}
      trackId={trackId}
      provider={provider}
      providerId={provider.id}
      lyricsProvider={lyricsProvider}
    />
  );
}
