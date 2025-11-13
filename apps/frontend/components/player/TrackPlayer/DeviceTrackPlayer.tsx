import useAddTrackQuery from "@/hooks/queries/useAddTrackQuery";
import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";

export default function DeviceTrackPlayer() {
  const { data: addTrackResult, error: addTrackError } = useAddTrackQuery();

  const { data: coverColor } = useCoverColorQuery(addTrackResult.coverUrl);
}
