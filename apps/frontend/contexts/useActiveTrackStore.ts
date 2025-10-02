import { create } from "zustand";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

type DetailedTrack = Track & TrackDetail;

interface ActiveTrackState {
  track: Partial<DetailedTrack> | null;
  isSynced: boolean;
}

interface ActiveTrackActions {
  setTrack: (track: Partial<DetailedTrack> | null) => void;
  setIsSynced: (isSynced: boolean) => void;
}

type ActiveTrackStore = ActiveTrackState & ActiveTrackActions;

export const useActiveTrackStore = create<ActiveTrackStore>((set) => ({
  track: null,
  isSynced: false,

  setTrack: (track) => set({ track }),
  setIsSynced: (isSynced) => set({ isSynced }),
}));
