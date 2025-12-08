import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";

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
  const { data, error } = useRequestStory({ ...props, language: setting.defaultLanguage });

  if (error) throw error;

  // "IN_PROGRESS"이거나 "COMPLETED" 상태일 때만 story 데이터를 전달
  let story: (BaseStoryFields & Partial<GeneratedStoryFields>) | undefined = undefined;
  if (data?.status === "IN_PROGRESS" || data?.status === "COMPLETED") {
    const { status, ...storyData } = data;
    story = storyData;
  }

  return <PlayerContent track={track} story={story} status={data?.status} />;
}
