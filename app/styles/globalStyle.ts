import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}
  
  html, body, form, fieldset, table, tr, td, img {
    margin: 0;
    padding: 0;
    font-family: "-apple-system", "BlinkMacSystemFont", "Apple SD Gothic Neo", "Pretendard Variable", "Pretendard", "Roboto", "Noto Sans KR", "Segoe UI", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "sans-serif";
  }
  
  input, button, select, textarea, optgroup, option {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;
