import { useQuery } from "@tanstack/react-query";

import { MediaModule } from "@/core/mediaModule";

const CHECK_INTERVAL_MS = 5000;

/**
 * 알림 권한 부여 여부를 주기적으로 확인하는 훅
 * @returns 권한 부여 여부
 */
export default function useCheckNotificationPermission() {
  const { data: granted = false } = useQuery({
    queryKey: ["notification-permission"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return MediaModule.checkNotificationPermission();
    },
    refetchInterval: CHECK_INTERVAL_MS,
    initialData: false,
    refetchOnWindowFocus: true,
  });

  return granted;
}
