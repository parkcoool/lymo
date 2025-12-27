import { useEffect, useState } from "react";

import { MediaModule } from "@/core/mediaModule";

const CHECK_INTERVAL_MS = 5000;

/**
 * 알림 권한 부여 여부를 주기적으로 확인하는 훅
 * @returns 권한 부여 여부
 */
export default function useCheckNotificationPermission() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    if (granted) return;

    const checkPermission = async () => {
      const granted = await MediaModule.checkNotificationPermission();
      setGranted(granted);
    };

    const intervalRef = setInterval(checkPermission, CHECK_INTERVAL_MS);
    checkPermission();

    return () => clearInterval(intervalRef);
  }, [granted]);

  return granted;
}
