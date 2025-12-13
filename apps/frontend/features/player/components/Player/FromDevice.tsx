import { useSettingStore } from "@/entities/setting/models/store";
import useRetrieveTrack from "@/features/player/hooks/useRetrieveTrack";
import useStoryQuery from "@/features/player/hooks/useStoryQuery";

import PlayerContent from "./PlayerContent";
import StoryRequest from "./StoryRequest";

interface FromDeviceProps {
  title: string;
  artist: string;
  durationInSeconds: number;
}

export default function FromDevice(props: FromDeviceProps) {
  const { setting } = useSettingStore();

  const { data: track } = useRetrieveTrack(props);
  const { data: story } = useStoryQuery({
    trackId: track?.id,
    language: setting.language,
    enabled: !!track?.id,
  });

  if (story !== null) return <PlayerContent track={track?.data} story={story} />;

  return <StoryRequest track={track?.data} {...props} />;
}
