import { useSettingStore } from "@/contexts/useSettingStore";
import useRequestTrack from "@/hooks/queries/useRequestTrack";

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

export default function RequestTrack(props: RequestTrackProps) {
  const { setting } = useSettingStore();
  const { data, error } = useRequestTrack({ ...props, language: setting.defaultLanguage });

  if (error) throw error;
  if (!data) return null;
}
