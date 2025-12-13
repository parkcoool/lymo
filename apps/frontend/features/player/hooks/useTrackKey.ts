import { usePathname } from "expo-router";

import { TrackSource, useTrackSourceStore } from "@/contexts/useTrackSourceStore";

/**
 * @description 현재 재생 중인 트랙의 키를 반환하는 훅입니다.
 * 트랙의 키는 "곡 별 가사 싱크" 설정에 사용됩니다.
 * @returns 현재 재생 중인 트랙의 키와 상태
 */
export default function useTrackKey() {
  const { trackSource } = useTrackSourceStore();
  const pathname = usePathname();

  // 현재 플레이어 화면인지 여부
  const isPlayerScreen = pathname.startsWith("/player");

  // `trackSyncDelay` map의 키로 사용할 트랙 키
  const trackKey = trackSource && isPlayerScreen ? getTrackKey(trackSource) : null;

  return trackKey;
}

/**
 * `TrackSource`에 따라 고유한 곡 키를 반환하는 함수입니다.
 * @param trackSource 트랙 출처 객체
 * @returns 곡 키 문자열
 */
const getTrackKey = (trackSource: TrackSource) => {
  if (trackSource.from === "device")
    return `${trackSource.track.title}-${trackSource.track.artist}`;
  else return trackSource.track.id;
};
