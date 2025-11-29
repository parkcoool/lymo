import { useSettingStore } from "@/contexts/useSettingStore";
import useTrackAndStoryQuery from "@/hooks/queries/useTrackAndStoryQuery";

import PlayerContent from "./PlayerContent";
import StoryRequest from "./StoryRequest";

interface FromFromManualProps {
  trackId: string;
}

export default function FromManual({ trackId }: FromFromManualProps) {
  const { setting } = useSettingStore();
  const [{ data: track }, { data: story }] = useTrackAndStoryQuery({
    trackId,
    language: setting.defaultLanguage,
  });

  if (story === null) return <StoryRequest track={track} trackId={trackId} />;

  return <PlayerContent track={track} story={story} />;
}
