import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import { useSettingStore } from "@/entities/setting/models/settingStore";

import useCurrentTrack from "./useCurrentTrack";

/**
 * 현재 곡에 대한 타임스탬프 딜레이를 반환합니다.
 * @returns 타임스탬프 딜레이 (초)
 */
export default function useTimestampDelayInSeconds() {
  const currentTrack = useCurrentTrack();
  const { setting } = useSettingStore();
  const { deviceMedia } = useDeviceMediaStore();

  const { sync: syncMap } = setting;
  const { duration: deviceDuration } = deviceMedia ?? {};

  if (currentTrack === undefined) return 0;

  let delay = syncMap.get(currentTrack.id) ?? 0;
  if (deviceDuration !== undefined)
    delay += Math.abs(currentTrack.data.durationInSeconds - deviceDuration);

  return delay;
}
