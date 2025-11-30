import { useSettingStore } from "@/contexts/useSettingStore";
import useRetrieveTrack from "@/hooks/queries/useRetrieveTrack";
import useStoryQuery from "@/hooks/queries/useStoryQuery";

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
    language: setting.defaultLanguage,
    enabled: !!track?.id,
  });

  if (story !== null) return <PlayerContent track={track?.data} story={story} />;

  return <StoryRequest track={track?.data} {...props} />;
}
