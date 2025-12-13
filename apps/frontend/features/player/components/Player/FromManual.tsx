import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/entities/setting/models/store";
import useStoryQuery from "@/features/player/hooks/useStoryQuery";

import PlayerContent from "./PlayerContent";
import StoryRequest from "./StoryRequest";

interface FromFromManualProps {
  trackId: string;
  track: Track;
}

export default function FromManual({ trackId, track }: FromFromManualProps) {
  const { setting } = useSettingStore();
  const { data: story } = useStoryQuery({
    trackId,
    language: setting.language,
  });

  if (story === null) return <StoryRequest track={track} trackId={trackId} />;

  return <PlayerContent track={track} story={story} />;
}
