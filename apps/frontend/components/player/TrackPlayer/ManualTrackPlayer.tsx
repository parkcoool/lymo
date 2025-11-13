import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import useProvidersQuery from "@/hooks/queries/useProviderQuery";
import useTrackQuery from "@/hooks/queries/useTrackQuery";

import PlayerContent from "./PlayerContent";

export default function ManualTrackPlayer() {
  const { data: track, error: trackError } = useTrackQuery();
  const { data: providers, error: providersError } = useProvidersQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

  if (trackError) throw trackError;
  if (providersError) throw providersError;

  if (providers.length === 0) return <StreamingTrackPlayer />;
  else return <PlayerContent />;
}
