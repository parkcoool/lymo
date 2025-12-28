import { useQuery } from "@tanstack/react-query";

import { MediaModule } from "@/core/mediaModule";

const CHECK_INTERVAL_MS = 5000;

/**
 * 알림 접근 권한 부여 여부를 주기적으로 확인하는 훅
 * @returns 권한 부여 여부
 */
export default function useCheckNotificationListenerPermission() {
  const { data: granted } = useQuery({
    queryKey: ["notification-listener-permission"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MediaModule.checkNotificationListenerPermission();
    },
    refetchInterval: CHECK_INTERVAL_MS,
    initialData: false,
  });

  return granted;
}
