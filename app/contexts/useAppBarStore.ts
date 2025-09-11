import { create } from "zustand";

import type { AppBarVariant } from "~/types/appBar";

interface AppBarState {
  overrideVariant?: AppBarVariant;
  searchQuery: string;
  songTitle: string;
  setOverrideVariant: (variant: AppBarVariant) => void;
  resetOverrideVariant: () => void;
  setSearchQuery: (query: string) => void;
  setSongTitle: (title: string) => void;
}

export const useAppBarStore = create<AppBarState>((set) => ({
  overrideVariant: undefined,
  searchQuery: "",
  songTitle: "",
  setOverrideVariant: (variant) => set({ overrideVariant: variant }),
  resetOverrideVariant: () => set({ overrideVariant: undefined }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSongTitle: (title) => set({ songTitle: title }),
}));
