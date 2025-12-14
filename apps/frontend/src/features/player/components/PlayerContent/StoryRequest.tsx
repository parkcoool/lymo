import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import useRequestStoryQuery from "@/entities/story/hooks/useRequestStoryQuery";

import PlayerView from "../PlayerView";

type StoryRequestProps = (
  | {
      trackId: string;
    }
  | {
      title: string;
      artist: string;
      durationInSeconds: number;
    }
) & { track?: Track };

/**
 * 해석이 존재하지 않는 경우, 해석 요청을 수행하고 그 진행 상태에 따라 플레이어를 렌더링하는 컴포넌트입니다.
 */
export default function StoryRequest({ track, ...props }: StoryRequestProps) {
  const { setting } = useSettingStore();
  const {
    data: story,
    isFetching,
    error,
  } = useRequestStoryQuery({ ...props, language: setting.language });

  if (error) throw error;

  return <PlayerView track={track} story={story} isCompleted={!isFetching} />;
}
