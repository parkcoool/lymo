import { type RefObject, useCallback, useEffect, useState } from "react";
import type { NativeMethods } from "react-native";

/**
 * 컴포넌트의 창 기준 y 좌푯값을 가져오는 훅입니다.
 * 컴포넌트는 `NativeMethods`를 지원하여야 합니다.
 *
 * @param ref 컴포넌트의 ref
 * @returns 창 기준 y 좌푯값과 측정 함수
 */
export default function useYOffsetInWindow<T extends NativeMethods>(ref: RefObject<T | null>) {
  const [y, setY] = useState(0);

  // 능동적으로 측정을 요청하는 함수
  const measure = useCallback(() => {
    ref.current?.measureInWindow((_x, measuredY) => {
      setY(measuredY);
    });
  }, [ref]);

  // 컴포넌트가 마운트되고 측정
  useEffect(() => {
    measure();
    const timer = setTimeout(measure, 100);
    return () => clearTimeout(timer);
  }, [measure]);

  return { y, measure };
}
