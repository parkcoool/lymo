import { create } from "zustand";

import type { CompactSong, SourceProvider } from "~/types/song";

interface PlayerState {
  isPlaying: boolean;
  song: CompactSong | null;
  sourceProvider: SourceProvider | null;
  sourceId: string | null;
  playPause: (play?: boolean) => void;
  setSong: (
    song: CompactSong,
    sourceProvider: SourceProvider,
    sourceId: string
  ) => void;
  time: number;
  setTime: (time: number) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  song: null,
  sourceProvider: null,
  sourceId: null,
  playPause: (play?: boolean) =>
    set((state) => ({
      isPlaying: play ?? !state.isPlaying,
    })),
  setSong: (song, sourceProvider, sourceId) =>
    set({ song, sourceProvider, sourceId }),
  time: 0,
  setTime: (time) => set({ time }),
}));

export default usePlayerStore;
