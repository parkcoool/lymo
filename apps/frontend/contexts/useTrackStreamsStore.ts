import { TrackStreamResult } from "@/types/track";
import { create } from "zustand";

interface TrackStreamsStates {
  trackStreams: Map<string, TrackStreamResult>;
}

interface TrackStreamsActions {
  setTrackStream: (
    streamTrackInfo: StreamTrackInfo,
    track: TrackStreamResult
  ) => void;
  getTrackStream: (
    streamTrackInfo: StreamTrackInfo
  ) => TrackStreamResult | undefined;
}

type TrackStreamsStore = TrackStreamsStates & TrackStreamsActions;

export const useTrackStreamsStore = create<TrackStreamsStore>((set, get) => ({
  trackStreams: new Map(),

  setTrackStream: (streamTrackInfo: StreamTrackInfo, track) =>
    set((state) => {
      const newMap = new Map(state.trackStreams);
      const key = getKey(streamTrackInfo);
      newMap.set(key, track);
      return { trackStreams: newMap };
    }),

  getTrackStream: (streamTrackInfo: StreamTrackInfo) => {
    const key = getKey(streamTrackInfo);
    return get().trackStreams.get(key);
  },
}));

function getKey({ title, artist, duration }: StreamTrackInfo) {
  return `${title}-${artist}-${duration}`;
}

interface StreamTrackInfo {
  title: string;
  artist: string;
  duration: number;
}
