import { useEffect, useState } from "react";
import { Dimensions, type ScaledSize } from "react-native";

/**
 * @description 창의 크기를 가져오는 훅입니다.
 * @returns 창의 가로 및 세로 크기
 */
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = ({ window }: { window: ScaledSize }) => {
      setWindowSize({
        width: window.width,
        height: window.height,
      });
    };

    Dimensions.addEventListener("change", handleResize);

    // 초기 크기 설정
    const window = Dimensions.get("window");
    setWindowSize(window);
  }, []);

  return windowSize;
}
