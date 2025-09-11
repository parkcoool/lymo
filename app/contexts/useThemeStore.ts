import type { DefaultTheme } from "styled-components";
import { create } from "zustand";

import theme from "~/styles/theme";

interface ThemeState {
  theme: DefaultTheme;
  setDynamicBackground: (color: string) => void;
  resetDynamicBackground: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  theme,

  setDynamicBackground: (color) => {
    document.body.style.backgroundColor = color;

    set((state) => ({
      theme: {
        ...state.theme,
        colors: {
          ...state.theme.colors,
          dynamicBackground: color,
        },
      },
    }));
  },

  resetDynamicBackground: () => {
    document.body.style.backgroundColor = "";

    set((state) => ({
      theme: {
        ...state.theme,
        colors: {
          ...state.theme.colors,
          dynamicBackground: undefined,
        },
      },
    }));
  },
}));

export default useThemeStore;
