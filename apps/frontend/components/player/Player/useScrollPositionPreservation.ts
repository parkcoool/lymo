import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";

interface UseScrollPositionPreservationParams {
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollYRef: React.RefObject<number>;
}

interface UseScrollPositionPreservationReturn {
  contentRef: React.RefObject<View | null>;
  handleLayout: () => void;
}

/**
 * @description 스크롤뷰의 위치가 동적으로 변할 때 현재 보이는 콘텐츠의 위치를 유지하는 훅입니다.
 * 스트리밍 데이터로 인해 상단 컴포넌트가 확장될 때, 사용자가 보고 있던 콘텐츠가 아래로 밀리지 않도록 스크롤 위치를 자동으로 조정합니다.
 *
 * @param scrollViewRef - ScrollView의 ref
 * @param scrollYRef - ScrollView의 현재 스크롤 Y 값을 추적하는 ref
 * @returns contentRef: 위치를 추적할 컨테이너의 ref, handleLayout: onLayout 이벤트 핸들러
 */
export default function useScrollPositionPreservation({
  scrollViewRef,
  scrollYRef,
}: UseScrollPositionPreservationParams): UseScrollPositionPreservationReturn {
  const contentRef = useRef<View>(null);
  const [contentY, setContentY] = useState<number | null>(null);
  const prevContentYRef = useRef<number | null>(null);

  // 콘텐츠 위치가 변경되었을 때 스크롤 위치 조정
  useEffect(() => {
    if (contentY === null || prevContentYRef.current === null) {
      prevContentYRef.current = contentY;
      return;
    }

    // 콘텐츠 위치의 변화량 계산
    const deltaY = contentY - prevContentYRef.current;

    // 위치가 변경되었을 때만 스크롤 조정
    if (deltaY !== 0 && scrollViewRef.current) {
      const newScrollY = scrollYRef.current + deltaY;
      scrollViewRef.current.scrollTo({
        y: newScrollY,
        animated: false,
      });
      scrollYRef.current = newScrollY;
    }

    prevContentYRef.current = contentY;
  }, [contentY, scrollViewRef, scrollYRef]);

  // 콘텐츠 컨테이너의 레이아웃 측정
  const handleLayout = () => {
    if (contentRef.current && scrollViewRef.current) {
      contentRef.current.measureLayout(
        scrollViewRef.current as unknown as number,
        (_left, top) => {
          setContentY(top);
        },
        () => {
          // 측정 실패 시 무시
        }
      );
    }
  };

  return {
    contentRef,
    handleLayout,
  };
}
