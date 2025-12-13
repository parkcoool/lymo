import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/entities/setting/models/store";
import useRequestStory from "@/features/player/hooks/useRequestStoryQuery";

import PlayerContent from "./PlayerContent";

type RequestTrackProps = (
  | {
      trackId: string;
    }
  | {
      title: string;
      artist: string;
      durationInSeconds: number;
    }
) & { track?: Track };

export default function StoryRequest({ track, ...props }: RequestTrackProps) {
  const { setting } = useSettingStore();
  const {
    data: story,
    isFetching,
    error,
  } = useRequestStory({ ...props, language: setting.language });

  if (error) throw error;

  return <PlayerContent track={track} story={story} isCompleted={!isFetching} />;
}
