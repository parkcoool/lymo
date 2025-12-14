import useSyncDeviceMedia from "@/entities/deviceMedia/hooks/useSyncDeviceMedia";

interface SyncDeviceMediaProps {
  children?: React.ReactNode;
}

export default function SyncDeviceMediaProvider({ children }: SyncDeviceMediaProps) {
  useSyncDeviceMedia();

  return <>{children}</>;
}
