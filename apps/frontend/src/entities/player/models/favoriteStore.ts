import { useState, ReactNode, createElement } from "react";
import { buildContext } from "react-simplikit";

interface FavoriteContextStates {
  favoriteDeltaMap: Map<string, number>;
}

interface FavoriteContextStateActions {
  setFavoriteDeltaMap: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  add: (storyId: string, delta: number) => void;
}

type FavoriteContextValues = FavoriteContextStates & FavoriteContextStateActions;

const [FavoriteContextProvider, useFavoriteStore] = buildContext<FavoriteContextValues>(
  "FavoriteContext",
  {
    favoriteDeltaMap: new Map(),
    setFavoriteDeltaMap: () => {},
    add: () => {},
  }
);

function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favoriteDeltaMap, setFavoriteDeltaMap] = useState<Map<string, number>>(new Map());

  const add = (storyId: string, delta: number) => {
    setFavoriteDeltaMap((prev) => {
      const newData = new Map(prev);
      const currentDelta = newData.get(storyId) ?? 0;
      newData.set(storyId, currentDelta + delta);
      return newData;
    });
  };

  // react-simplikit의 buildContext에서 생성된 Provider는 children을 props로 받도록 설계됨
  // eslint-disable-next-line react/no-children-prop
  return createElement(FavoriteContextProvider, {
    favoriteDeltaMap,
    setFavoriteDeltaMap,
    add,
    children,
  });
}

export { FavoriteProvider, useFavoriteStore };
