import { TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";

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
  const { data: providers, error } = useProvidersQuery({ trackId });

  if (error) throw error;

  // TODO: provider 선택 UI 추가
  const provider = providers.find((p) => p.id === providerId) ?? providers[0];

  if (providers.length === 0)
    return (
      <LyricsQuery
        track={track}
        trackId={trackId}
        trackDetail={trackDetail}
        lyricsProvider={lyricsProvider}
      />
    );

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
