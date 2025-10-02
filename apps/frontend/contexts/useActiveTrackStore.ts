import { create } from "zustand";

import type { DetailedTrackDocumentWithId } from "@/types/track";

interface ActiveTrackState {
  track: Partial<DetailedTrackDocumentWithId> | null;
  isSynced: boolean;
}

interface ActiveTrackActions {
  setTrack: (track: Partial<DetailedTrackDocumentWithId> | null) => void;
  setIsSynced: (isSynced: boolean) => void;
}

type ActiveTrackStore = ActiveTrackState & ActiveTrackActions;

export const useActiveTrackStore = create<ActiveTrackStore>((set) => ({
  track: null,
  isSynced: false,

  setTrack: (track) => set({ track }),
  setIsSynced: (isSynced) => set({ isSynced }),
}));
