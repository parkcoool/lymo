import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import useDeviceTrackQuery from "@/hooks/queries/useDeviceTrackQuery";

import PlayerContent from "./PlayerContent";

export default function DeviceTrackPlayer() {
  const { data: track, error } = useDeviceTrackQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

  if (error) throw error;

  return <PlayerContent track={track} coverColor={coverColor} />;
}
