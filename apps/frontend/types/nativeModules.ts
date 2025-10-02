import { EmitterSubscription, NativeEventEmitter } from "react-native";

export interface MediaModuleType {
  /**
   * 알림 접근 권한이 있는지 확인합니다.
   * @returns {Promise<boolean>} 권한이 있으면 true를 반환하는 Promise
   */
  checkNotificationListenerPermission(): Promise<boolean>;

  /**
   * 미디어 세션 관찰을 시작하고 현재 상태를 가져옵니다.
   * @returns {Promise<boolean>} 성공적으로 시작하면 true를 반환하는 Promise
   */
  startObserver(): Promise<boolean>;

  /**
   * 현재 재생 위치를 가져옵니다.
   * @returns {Promise<number>} 현재 재생 위치(ms)를 반환하는 Promise
   */
  getCurrentPosition(): Promise<number>;

  /**
   * 시스템의 '알림 접근 허용' 설정 화면을 엽니다.
   */
  openNotificationListenerSettings(): void;

  addListener: (eventType: string) => void;
  removeListeners: (count: number) => void;
}

// 'onMediaDataChanged' 이벤트가 전달하는 데이터의 타입을 정의합니다.
export type MediaData = {
  title: string;
  artist: string;
  album: string;
  duration: number;
  isPlaying: boolean;
  coverUrl: string; // Base64 문자열
};

// 모듈이 발생시키는 이벤트 이름과 해당 이벤트의 콜백 함수 타입을 매핑합니다.
export type MediaModuleEvents = {
  onMediaDataChanged: (data: MediaData | null) => void;
};
