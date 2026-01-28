import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import useStoryQuery from "@/entities/story/hooks/useStoryQuery";

import PlayerView from "../PlayerView";

import StoryRequest from "./StoryRequest";

interface FromManualProps {
  track: { id: string; data: Track };
}

/**
 * 수동으로 제공된 곡의 정보를 받아 그 해석을 불러와서 플레이어를 렌더링하는 컴포넌트입니다.
 */
export default function FromManual({ track }: FromManualProps) {
  const { setting } = useSettingStore();
  const { data: story } = useStoryQuery({
    trackId: track.id,
    language: setting.language,
  });

  // 1) 해석이 존재하지 않는 경우
  if (story === null) return <StoryRequest track={track} />;

  // 2) 해석이 존재하는 경우
  return <PlayerView track={track} story={story} />;
}
