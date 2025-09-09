import type { CSSProp } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      onBackground: string;
      onBackgroundSubtle: string;
      surface: string;
      onSurface: string;
      onSurfaceSubtle: string;
    };
  }
}

declare module "react" {
  interface DOMAttributes {
    css?: CSSProp;
  }
}
