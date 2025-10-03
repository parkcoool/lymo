import { create } from "zustand";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

interface ActiveTrackState {
  track: Partial<Track & TrackDetail> | null;
  isSynced: boolean;
}

interface ActiveTrackActions {
  setTrack: React.Dispatch<
    React.SetStateAction<Partial<Track & TrackDetail> | null>
  >;
  setIsSynced: (isSynced: boolean) => void;
}

type ActiveTrackStore = ActiveTrackState & ActiveTrackActions;

export const useActiveTrackStore = create<ActiveTrackStore>((set) => ({
  track: null,
  isSynced: false,

  setTrack: (track) => {
    if (typeof track === "function") {
      set((state) => ({ track: track(state.track) }));
    } else {
      set({ track });
    }
  },
  setIsSynced: (isSynced) => set({ isSynced }),
}));
