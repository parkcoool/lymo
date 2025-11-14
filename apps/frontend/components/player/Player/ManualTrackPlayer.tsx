import useTrackQuery from "@/hooks/queries/useTrackQuery";

import ProvidersQuery from "./ProvidersQuery";

interface ManualTrackPlayerProps {
  trackId: string;
}

export default function ManualTrackPlayer({ trackId }: ManualTrackPlayerProps) {
  const { data: track, error } = useTrackQuery({ trackId });

  if (error) throw error;

  // TODO: lyricsProvider 우선 순위 결정
  const lyricsProvider = track.lyricsProviders[0];

  return <ProvidersQuery track={track} trackId={trackId} lyricsProvider={lyricsProvider} />;
}
