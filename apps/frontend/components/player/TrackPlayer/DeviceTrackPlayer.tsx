import useCoverColorQuery from "@/hooks/useCoverColorQuery";
import useDeviceTrackQuery from "@/hooks/useDeviceTrackQuery";

import TrackPlayer from "./TrackPlayer";

export default function DeviceTrackPlayer() {
  const { data: track, error } = useDeviceTrackQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

  if (error) throw error;

  return <TrackPlayer track={track} coverColor={coverColor} />;
}
