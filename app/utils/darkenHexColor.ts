/**
 * 주어진 HEX 색상을 지정된 비율만큼 어둡게 만듭니다.
 * @param hexColor - 어둡게 만들 HEX 색상 문자열 (예: "#RRGGBB" 또는 "#RGB").
 * @param percent - 어둡게 할 밝기 비율 (0에서 100 사이의 숫자).
 * @returns 어두워진 새로운 HEX 색상 문자열.
 */
export default function darkenHexColor(
  hexColor: string,
  percent: number
): string {
  // HEX 색상 코드에서 '#' 제거하고, 3자리 코드(#RGB)인 경우 6자리(#RRGGBB)로 변환
  let hex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 6자리 HEX 코드가 아니면 에러 발생
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color format.");
  }

  // 퍼센트 값을 0과 100 사이로 제한
  const percentage = Math.max(0, Math.min(100, percent));

  // RGB 각 색상 값을 10진수로 변환
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // 각 색상 값을 주어진 비율만큼 어둡게 계산
  // `(1 - percentage / 100)`을 곱하여 값을 줄입니다.
  const newR = Math.round(r * (1 - percentage / 100));
  const newG = Math.round(g * (1 - percentage / 100));
  const newB = Math.round(b * (1 - percentage / 100));

  // 계산된 RGB 값을 다시 16진수로 변환하고, 2자리로 맞추기 위해 '0'을 채웁니다.
  const toHex = (c: number) => ("0" + c.toString(16)).slice(-2);

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
