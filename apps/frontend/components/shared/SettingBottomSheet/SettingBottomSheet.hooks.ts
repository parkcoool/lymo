import { usePathname } from "expo-router";

import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";

import { getTrackKey } from "./SettingBottomSheet.helpers";

/**
 * @description 현재 재생 중인 트랙의 키를 반환하는 훅입니다.
 * 트랙의 키는 "곡 별 가사 싱크" 설정에 사용됩니다.
 * @returns 현재 재생 중인 트랙의 키와 상태
 */
export function useTrackKey() {
  const { trackSource } = useTrackSourceStore();
  const pathname = usePathname();

  // 현재 플레이어 화면인지 여부
  const isPlayerScreen = pathname.startsWith("/player");

  // `trackSyncDelay` map의 키로 사용할 트랙 키
  const trackKey = trackSource && isPlayerScreen ? getTrackKey(trackSource) : null;

  return trackKey;
}
