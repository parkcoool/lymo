import { create } from "zustand";
import type { Track } from "@lymo/schemas/shared";

import type { DeviceMedia } from "@/types/nativeModules";

type TrackSource =
  | {
      from: "device";
      track: Pick<
        DeviceMedia,
        "title" | "artist" | "album" | "duration" | "coverUrl"
      >;
    }
  | {
      from: "manual";
      track: Pick<Track, "id" | "title" | "coverUrl">;
    };

interface TrackSourceStates {
  trackSource?: TrackSource;
}

interface TracSourceActions {
  setTrackSource: (track?: TrackSource) => void;
}

type TrackSourceStore = TrackSourceStates & TracSourceActions;

export const useTrackSourceStore = create<TrackSourceStore>((set) => ({
  trackSource: undefined,

  setTrackSource: (trackSource) => set({ trackSource }),
}));
