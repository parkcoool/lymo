import type { RefObject } from "react";
import { create } from "zustand";

import type { CompactSong, SourceProvider } from "~/types/song";

interface PlayerState {
  isPlaying: boolean;
  song: CompactSong | null;
  sourceProvider: SourceProvider | null;
  sourceId: string | null;
  setIsPlaying: (isPlaying: boolean) => void;
  setSong: (
    song: CompactSong,
    sourceProvider: SourceProvider,
    sourceId: string
  ) => void;
  time: number;
  setTime: (time: number) => void;
  player: RefObject<HTMLVideoElement | null>;
}

const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  song: null,
  sourceProvider: null,
  sourceId: null,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setSong: (song, sourceProvider, sourceId) =>
    set({ song, sourceProvider, sourceId }),
  time: 0,
  setTime: (time) => set({ time }),
  player: { current: null },
}));

export default usePlayerStore;
