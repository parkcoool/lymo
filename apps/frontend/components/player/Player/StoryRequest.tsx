import { Track } from "@lymo/schemas/doc";

import { useSettingStore } from "@/contexts/useSettingStore";
import useRequestStory from "@/hooks/queries/useRequestStoryQuery";

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
  } = useRequestStory({ ...props, language: setting.defaultLanguage });

  if (error) throw error;

  return (
    <PlayerContent track={track} story={story} status={isFetching ? "IN_PROGRESS" : undefined} />
  );
}
