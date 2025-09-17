import type { RefObject } from "react";
import { create } from "zustand";

import type { PlayerState, Song } from "~/types/song";

interface PlayingSongState {
  playerState: PlayerState;
  setPlayerState: (state: PlayerState) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  time: number;
  setTime: (time: number) => void;
  song: Partial<Song> | null;
  setSong: (song: Partial<Song> | null) => void;
  playerRef: RefObject<HTMLVideoElement | null>;
}

const usePlayingSongStore = create<PlayingSongState>((set) => ({
  playerState: "idle",
  setPlayerState: (state) => set({ playerState: state }),
  isPlaying: false,
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  time: 0,
  setTime: (time) => set({ time }),
  song: null,
  setSong: (song) => {
    set({ song });
  },
  playerRef: { current: null },
}));

export default usePlayingSongStore;
