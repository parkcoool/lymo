import { create } from "zustand";

import type { CompactSong } from "~/types/song";

interface PlayerState {
  isPlaying: boolean;
  song: CompactSong | null;
  playPause: () => void;
  setSong: (song: CompactSong) => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  song: null,
  playPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSong: (song) => set({ song }),
}));

export default usePlayerStore;
