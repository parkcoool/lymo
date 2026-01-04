import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import useRequestStoryQuery from "@/entities/story/hooks/useRequestStoryQuery";

import PlayerView from "../PlayerView";

type StoryRequestProps =
  | {
      track: { id: string; data: Track };
    }
  | {
      title: string;
      artist: string;
      durationInSeconds: number;
    };

/**
 * 해석이 존재하지 않는 경우, 해석 요청을 수행하고 그 진행 상태에 따라 플레이어를 렌더링하는 컴포넌트입니다.
 */
export default function StoryRequest(props: StoryRequestProps) {
  const { setting } = useSettingStore();
  const {
    data: story,
    isFetching,
    error,
  } = useRequestStoryQuery({
    ...("track" in props ? { trackId: props.track.id } : props),
    language: setting.language,
  });

  if (error) throw error;

  const isCompleted = !isFetching || story?.status === "COMPLETED" || story?.status === "FINISHED";

  return (
    <PlayerView
      track={"track" in props ? props.track : undefined}
      story={story}
      isCompleted={isCompleted}
    />
  );
}
