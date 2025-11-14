import useTrackAndProvidersQueries from "@/hooks/queries/useTrackAndProvidersQueries";

import DetailQuery from "./DetailQuery";
import StreamingQuery from "./StreamingQuery";

interface ManualTrackPlayerProps {
  trackId: string;
}

export default function ManualTrackPlayer({ trackId }: ManualTrackPlayerProps) {
  const { trackQuery, providersQuery } = useTrackAndProvidersQueries({ trackId });
  const { data: track, error: trackError } = trackQuery;
  const { data: providers, error: providersError } = providersQuery;

  if (trackError) throw trackError;
  if (providersError) throw providersError;

  // TODO: provider 선택 UI
  const provider = providers[0];
  // TODO: lyricsProvider 우선 순위 결정
  const lyricsProviders = track.lyricsProviders[0];

  if (providers.length === 0)
    return (
      <StreamingQuery
        track={track}
        trackId={trackId}
        provider={provider}
        lyricsProvider={lyricsProviders}
      />
    );
  else
    return (
      <DetailQuery
        track={track}
        trackId={trackId}
        provider={provider}
        providerId={provider.id}
        lyricsProvider={lyricsProviders}
      />
    );
}
