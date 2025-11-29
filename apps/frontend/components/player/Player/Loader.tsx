import { useSettingStore } from "@/contexts/useSettingStore";
import useRequestTrack from "@/hooks/queries/useRequestStoryQuery";

import PlayerContent from "./PlayerContent";

type RequestTrackProps =
  | {
      trackId: string;
    }
  | {
      title: string;
      artist: string;
      durationInSeconds: number;
    };

export default function Loader(props: RequestTrackProps) {
  const { setting } = useSettingStore();
  const { data, error } = useRequestTrack({ ...props, language: setting.defaultLanguage });

  if (error) throw error;

  const { trackPreview, storyPreview } = data ?? {};
  if (!trackPreview || !storyPreview) return null;
  return <PlayerContent track={trackPreview} storyPreview={storyPreview} />;
}
