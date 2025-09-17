import { create } from "zustand";

import type { Song } from "~/types/song";

type FetchingSongValues =
  | {
      fetchType: "add";
      title: string;
      artist: string;
      initialData?: Partial<Song>;
    }
  | { fetchType: "get"; id: string; initialData?: Partial<Song> }
  | { fetchType: "none" };

type FetchingSongState = {
  setFetchingSong: (value: FetchingSongValues) => void;
} & FetchingSongValues;

const useFetchingSongStore = create<FetchingSongState>((set) => ({
  fetchType: "none",
  setFetchingSong: (value) => set(value),
}));

export default useFetchingSongStore;
