import { NativeModule, requireNativeModule } from "expo";

import {
  MediaNotificationListenerModuleEvents,
  MediaSessionInfo,
} from "./MediaNotificationListener.types";

declare class MediaNotificationListenerModule extends NativeModule<MediaNotificationListenerModuleEvents> {
  /**
   * 현재 미디어 세션 정보를 가져옵니다
   * @returns 현재 미디어 세션 정보를 담은 Promise
   */
  getCurrentMediaSession(): Promise<MediaSessionInfo>;

  /**
   * 알림 접근 권한이 부여되었는지 확인합니다
   * @returns 권한이 부여되면 true, 아니면 false
   */
  hasNotificationListenerPermission(): boolean;

  /**
   * 알림 접근 허용 설정 화면을 엽니다
   */
  openNotificationListenerSettings(): void;

  /**
   * 미디어 세션 변경사항 관찰을 시작합니다
   * 'onMediaSessionChanged' 이벤트를 발생시킵니다
   */
  startObservingMediaSession(): Promise<void>;

  /**
   * 미디어 세션 변경사항 관찰을 중지합니다
   */
  stopObservingMediaSession(): void;
}

export default requireNativeModule<MediaNotificationListenerModule>("MediaNotificationListener");
