import { useSettingStore } from "@/entities/setting/models/settingStore";
import useStoryQuery from "@/entities/story/hooks/useStoryQuery";
import useRetrieveTrack from "@/entities/track/hooks/useRetrieveTrack";

import PlayerView from "../PlayerView";

import StoryRequest from "./StoryRequest";

interface FromDeviceParams {
  title: string;
  artist: string;
  durationInSeconds: number;
}

/**
 * 기기에서 재생 중인 곡의 정보와 그 해석을 불러와서 플레이어를 렌더링하는 컴포넌트입니다.
 */
export default function FromDevice(params: FromDeviceParams) {
  const { setting } = useSettingStore();

  const { data: track } = useRetrieveTrack(params);
  const { data: story } = useStoryQuery({
    trackId: track?.id,
    language: setting.language,
    enabled: !!track?.id,
  });

  // 1) 해석이 존재하지 않는 경우
  if (story === null) return <StoryRequest track={track?.data} {...params} />;

  // 2) 해석이 존재하는 경우
  return <PlayerView track={track?.data} story={story} />;
}
