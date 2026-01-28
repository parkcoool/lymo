type RGBA = { r: number; g: number; b: number; a: number };

/**
 * Hex 코드를 RGBA 객체로 변환
 * 3자리(#RGB), 4자리(#RGBA), 6자리(#RRGGBB), 8자리(#RRGGBBAA) 지원
 */
const hexToRgba = (hex: string): RGBA => {
  let c = hex.replace("#", "");

  // 단축 코드 (#FFF, #FFF0 등) 처리
  if (c.length === 3 || c.length === 4) {
    c = c
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // 알파 값이 없으면 255(1.0)로 처리
  const a = c.length === 8 ? parseInt(c.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
};

/**
 * RGBA 객체를 Hex 문자열(#RRGGBBAA)로 변환
 */
const rgbaToHex = ({ r, g, b, a }: RGBA): string => {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const alphaHex = Math.round(a * 255).toString(16);
  const alpha = alphaHex.length === 1 ? "0" + alphaHex : alphaHex;

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`.toUpperCase();
};

/**
 * 두 개의 RGBA 색상을 섞는 함수
 * background 위에 foreground를 올리는 방식
 */
const blend = (background: RGBA, foreground: RGBA): RGBA => {
  // 1) 결과 알파값 계산 (α_out = α_src + α_dst * (1 - α_src))
  const alphaOut = foreground.a + background.a * (1 - foreground.a);

  if (alphaOut === 0) return { r: 0, g: 0, b: 0, a: 0 };

  // 2) 각 색상 채널 계산
  const blendChannel = (bg: number, fg: number) => {
    return (fg * foreground.a + bg * background.a * (1 - foreground.a)) / alphaOut;
  };

  return {
    r: blendChannel(background.r, foreground.r),
    g: blendChannel(background.g, foreground.g),
    b: blendChannel(background.b, foreground.b),
    a: alphaOut,
  };
};

/**
 * 색상 배열을 받아 순차적으로 섞은 결과를 반환합니다.
 * @param colors Hex 색상 문자열 배열 (예: ['#FF0000', '#0000FF80'])
 * @returns 섞인 색상의 Hex 코드
 */
export default function mixColors(colors: string[]) {
  if (colors.length === 0) return "#00000000";
  if (colors.length === 1) return colors[0];

  // 배열의 첫 번째 색상을 바닥(Background)으로 두고, 그 위에 순차적으로 겹침
  const resultRgba = colors.map(hexToRgba).reduce((acc, curr) => blend(acc, curr));

  return rgbaToHex(resultRgba);
}
