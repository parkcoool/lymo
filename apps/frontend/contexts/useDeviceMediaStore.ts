import { create } from "zustand";
import type { MediaData } from "@/types/nativeModules";

interface DeviceMediaStates {
  data: MediaData | null;
  hasPermission: boolean;
}

interface DeviceMediaActions {
  setData: (mediaData: MediaData | null) => void;
  setHasPermission: (hasPermission: boolean) => void;
}

type MediaSessionStore = DeviceMediaStates & DeviceMediaActions;

export const useDeviceMediaStore = create<MediaSessionStore>((set) => ({
  data: null,
  hasPermission: false,

  setData: (session) => set({ data: session }),
  setHasPermission: (hasPermission) => set({ hasPermission }),
}));
