import { create } from "zustand";

interface SyncStates {
  isSynced: boolean;
}

interface SyncActions {
  setIsSynced: (isSynced: boolean) => void;
}

type SyncStore = SyncStates & SyncActions;

export const useSyncStore = create<SyncStore>((set) => ({
  isSynced: false,

  setIsSynced: (isSynced) => set({ isSynced }),
}));
