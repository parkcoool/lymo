import { create } from "zustand";
import { tracks } from "@lymo/schemas/database";

type TrackDoc = tracks.TrackDoc;
type TrackDetailDoc = tracks.TrackDetailDoc;
type Track = TrackDoc & TrackDetailDoc;

interface ActiveTrackState {
  track: Track | null;
  isSynced: boolean;
}

interface ActiveTrackActions {
  setTrack: (track: Track | null) => void;
  setIsSynced: (isSynced: boolean) => void;
}

type ActiveTrackStore = ActiveTrackState & ActiveTrackActions;

export const useActiveTrackStore = create<ActiveTrackStore>((set) => ({
  track: null,
  isSynced: false,

  setTrack: (track) => set({ track }),
  setIsSynced: (isSynced) => set({ isSynced }),
}));
