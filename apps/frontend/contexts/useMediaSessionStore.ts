import { create } from "zustand";
import type { MediaSession } from "@/types/mediaSession";

interface MediaSessionStates {
  session: MediaSession | null;
}

interface MediaSessionActions {
  setSession: (session: MediaSession | null) => void;
}

type MediaSessionStore = MediaSessionStates & MediaSessionActions;

export const useMediaSessionStore = create<MediaSessionStore>((set) => ({
  session: null,

  setSession: (session) => set({ session }),
}));
