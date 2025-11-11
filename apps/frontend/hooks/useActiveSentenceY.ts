import { type RefObject, useEffect, useState } from "react";
import type { NativeMethods } from "react-native";

/**
 * @description 컴포넌트의 창 기준 y 좌푯값을 가져오는 훅입니다.
 * 컴포넌트는 `NativeMethods`를 지원하여야 합니다.
 *
 * @param ref 컴포넌트의 ref
 * @returns 컴포넌트의 창 기준 y 좌푯값
 */
export default function useYOffsetInWindow<T extends NativeMethods>(
  ref: RefObject<T | null>
) {
  const [activeSentenceY, setActiveSentenceY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      ref.current?.measureInWindow((_, y) => setActiveSentenceY(y));
    }, 100);

    return () => clearInterval(interval);
  }, [ref]);

  return activeSentenceY;
}
