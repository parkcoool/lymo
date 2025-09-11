import { create } from "zustand";

type AppBarVariant = "none" | "home" | "player" | "search";

interface AppBarState {
  variant: AppBarVariant;
  searchQuery: string;
  songTitle: string;
  setVariant: (variant: AppBarVariant) => void;
  setSearchQuery: (query: string) => void;
  setSongTitle: (title: string) => void;
}

export const useAppBarStore = create<AppBarState>((set) => ({
  variant: "none",
  searchQuery: "",
  songTitle: "",
  setVariant: (variant) => set({ variant }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSongTitle: (title) => set({ songTitle: title }),
}));
