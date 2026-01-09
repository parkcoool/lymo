import { NativeModule, requireNativeModule } from "expo";

import {
  MediaInsightServiceModuleEvents,
  NotificationFrequency,
} from "./MediaInsightService.types";

declare class MediaInsightServiceModule extends NativeModule<MediaInsightServiceModuleEvents> {
  /**
   * 백그라운드 미디어 인사이트 서비스를 활성화 / 비활성화합니다.
   */
  setEnabled(enabled: boolean): void;

  /**
   * 서비스가 활성화되어 있는지 확인합니다.
   */
  isEnabled(): boolean;

  /**
   * 알림 빈도를 설정합니다.
   * @param frequency "never" | "always" | "normal" | "minimal"
   */
  setNotificationFrequency(frequency: NotificationFrequency): void;

  /**
   * 현재 설정된 알림 빈도를 가져옵니다.
   * @returns 알림 빈도
   */
  getNotificationFrequency(): NotificationFrequency;

  /**
   * 알림 접근 권한이 부여되었는지 확인합니다.
   */
  hasNotificationListenerPermission(): boolean;

  /**
   * 알림 접근 허용 설정 화면을 엽니다.
   */
  openNotificationListenerSettings(): void;
}

export default requireNativeModule<MediaInsightServiceModule>("MediaInsightService");
