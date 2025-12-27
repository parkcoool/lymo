import { DeviceMedia } from "./DeviceMedia";

export interface MediaModule {
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
   * 현재 미디어 상태를 가져옵니다.
   * @returns {Promise<DeviceMedia | null>} 현재 미디어 상태를 반환하는 Promise
   */
  getCurrentMediaState(): Promise<DeviceMedia | null>;

  /**
   * 현재 재생 위치를 가져옵니다.
   * @returns {Promise<number>} 현재 재생 위치(ms)를 반환하는 Promise
   */
  getCurrentPosition(): Promise<number>;

  /**
   * 시스템의 '알림 접근 허용' 설정 화면을 엽니다.
   */
  openNotificationListenerSettings(): void;

  /**
   * 인사이트 알림을 표시합니다.
   * @param title 알림 제목
   * @param content 알림 내용
   */
  showInsightNotification(title: string, content: string): void;

  addListener(eventType: string): void;
  removeListeners(count: number): void;
}
