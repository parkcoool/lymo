import { useEffect, useState } from "react";
import { Dimensions, type ScaledSize } from "react-native";

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
