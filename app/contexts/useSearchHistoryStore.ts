import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  histories: string[];
  deleteHistory: (history: string) => void;
  deleteAllHistories: () => void;
  addHistory: (history: string) => void;
}

export const useSearchHistoryStore = create(
  persist<SearchHistoryState>(
    (set) => ({
      histories: [],

      deleteHistory: (history) =>
        set((state) => ({
          histories: state.histories.filter((h) => h !== history),
        })),

      deleteAllHistories: () => set({ histories: [] }),

      addHistory: (history) =>
        set((state) => {
          const newHistories = [
            history,
            ...state.histories.filter((h) => h !== history),
          ];
          if (newHistories.length > 10) {
            newHistories.pop();
          }
          return { histories: newHistories };
        }),
    }),
    {
      name: "search-history",
    }
  )
);
