import { create } from "zustand";

interface AppBarState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useAppBarStore = create<AppBarState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
