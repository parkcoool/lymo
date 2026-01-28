import { useQuery } from "@tanstack/react-query";

import MediaInsightServiceModule from "modules/media-insight-service";

const CHECK_INTERVAL_MS = 5000;

/**
 * 알림 권한 부여 여부를 주기적으로 확인하는 훅
 * @return 권한 부여 여부
 */
export default function useCheckNotificationPermission() {
  const { data: granted } = useQuery({
    queryKey: ["notification-permission"],
    queryFn: () => {
      return MediaInsightServiceModule.hasPostNotificationPermission();
    },
    refetchInterval: CHECK_INTERVAL_MS,
    initialData: false,
    refetchOnWindowFocus: true,
  });

  return granted;
}
