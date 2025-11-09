import React, { useState, ReactNode } from "react";
import { buildContext } from "react-simplikit";

interface SearchHistoryContextStates {
  histories: string[];
}

interface SearchHistoryContextActions {
  deleteHistory: (history: string) => void;
  deleteAllHistories: () => void;
  addHistory: (history: string) => void;
}

type SearchHistoryContextValues = SearchHistoryContextStates &
  SearchHistoryContextActions;

const [SearchHistoryContextProvider, useSearchHistoryStore] =
  buildContext<SearchHistoryContextValues>("SearchHistoryContext", {
    histories: [],
    deleteHistory: () => {},
    deleteAllHistories: () => {},
    addHistory: () => {},
  });

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [histories, setHistories] = useState<string[]>([]);

  const deleteHistory = (history: string) => {
    setHistories((prev) => prev.filter((h) => h !== history));
  };

  const deleteAllHistories = () => {
    setHistories([]);
  };

  const addHistory = (history: string) => {
    setHistories((prev) => {
      const newHistories = [history, ...prev.filter((h) => h !== history)];
      if (newHistories.length > 10) {
        newHistories.pop();
      }
      return newHistories;
    });
  };

  return React.createElement(SearchHistoryContextProvider, {
    histories,
    deleteHistory,
    deleteAllHistories,
    addHistory,
    children,
  });
}

export { useSearchHistoryStore };
