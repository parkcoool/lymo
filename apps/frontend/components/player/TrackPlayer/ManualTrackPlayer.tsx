import useCoverColorQuery from "@/hooks/useCoverColorQuery";
import useManualTrackQuery from "@/hooks/useManualTrackQuery";

import TrackPlayer from "./TrackPlayer";

export default function ManualTrackPlayer() {
  const { data: track, error } = useManualTrackQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

  if (error) throw error;

  return <TrackPlayer track={track} coverColor={coverColor} />;
}
