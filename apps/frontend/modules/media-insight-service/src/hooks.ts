import { useState } from "react";

import type { NotificationFrequency } from "./MediaInsightService.types";
import MediaInsightServiceModule from "./MediaInsightServiceModule";

/**
 * 백그라운드 미디어 인사이트 서비스 관리 훅
 */
export function useMediaInsightService() {
  const [isEnabled, setIsEnabled] = useState(MediaInsightServiceModule.isEnabled());
  const [hasPermission, setHasPermission] = useState(
    MediaInsightServiceModule.hasNotificationListenerPermission()
  );
  const [frequency, setFrequencyState] = useState<NotificationFrequency>(
    MediaInsightServiceModule.getNotificationFrequency()
  );

  const enable = () => {
    MediaInsightServiceModule.setEnabled(true);
    setIsEnabled(true);
  };

  const disable = () => {
    MediaInsightServiceModule.setEnabled(false);
    setIsEnabled(false);
  };

  const setFrequency = (freq: NotificationFrequency) => {
    MediaInsightServiceModule.setNotificationFrequency(freq);
    setFrequencyState(freq);
  };

  const openSettings = () => {
    MediaInsightServiceModule.openNotificationListenerSettings();
  };

  const checkPermission = () => {
    const hasPermission = MediaInsightServiceModule.hasNotificationListenerPermission();
    setHasPermission(hasPermission);
    return hasPermission;
  };

  return {
    isEnabled,
    hasPermission,
    frequency,
    enable,
    disable,
    setFrequency,
    openSettings,
    checkPermission,
  };
}
