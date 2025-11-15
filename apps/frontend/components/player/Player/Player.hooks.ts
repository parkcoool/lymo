import { TrackDoc } from "@lymo/schemas/doc";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

interface UseTrackingParams {
  currentY: number;
  track: TrackDoc;
}

interface UseTrackingReturn {
  isTrackingMode: boolean;
  isAutoScrollingRef: React.RefObject<boolean>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollYRef: React.RefObject<number>;
  scrollTo: (y: number) => void;
  handleScrollViewScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollEnd: () => void;
  handleMoveToCurrent: () => void;
}

export function useTracking({ currentY, track }: UseTrackingParams): UseTrackingReturn {
  // 트래킹 모드 활성화 여부
  const [isTrackingMode, setIsTrackingMode] = useState(false);

  // 자동 스크롤 중인지 여부 (사용자 스크롤과 구분하기 위함)
  const isAutoScrollingRef = useRef<boolean>(false);
  // 스크롤뷰
  const scrollViewRef = useRef<ScrollView>(null);
  // 스크롤뷰의 스크롤 y 값
  const scrollYRef = useRef<number>(0);

  // 스크롤 함수
  const scrollTo = useCallback(
    (y: number) => {
      if (isAutoScrollingRef.current || Math.abs(scrollYRef.current - y) < 5) return;

      isAutoScrollingRef.current = true;
      // console.log("auto scrolling started");
      scrollViewRef.current?.scrollTo({ y, x: 0, animated: true });
    },
    [isAutoScrollingRef]
  );

  // 스크롤뷰 스크롤 이벤트 핸들러
  const handleScrollViewScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = e.nativeEvent.contentOffset.y;

      // 사용자가 직접 스크롤을 조작한 경우에만 트래킹 모드 비활성화
      if (isAutoScrollingRef.current || !isTrackingMode) return;

      setIsTrackingMode(false);
      // console.log("tracking mode deactivated");
    },
    [isTrackingMode]
  );

  // 스크롤 종료 이벤트 핸들러
  const handleScrollEnd = useCallback(() => {
    if (!isAutoScrollingRef.current) return;
    isAutoScrollingRef.current = false;
    // console.log("auto scrolling ended");
  }, []);

  // 현재 가사로 이동 이벤트 핸들러
  const handleMoveToCurrent = useCallback(() => {
    scrollTo(scrollYRef.current + currentY - 200);
    setIsTrackingMode(true);
    // console.log("tracking mode activated");
  }, [currentY, scrollTo]);

  // tracking 모드일 때 현재 활성화된 문장으로 자동 스크롤
  useEffect(() => {
    if (!isTrackingMode) return;
    if (isAutoScrollingRef.current) return;

    // currentY가 정위치에 있지 않으면 스크롤
    const isVisible = currentY > 195 && currentY < 205;
    if (!isVisible) {
      scrollTo(scrollYRef.current + currentY - 200);
    }
  }, [currentY, isTrackingMode, scrollTo]);

  // 곡이 바뀌면 최상단으로 이동
  useEffect(() => {
    scrollTo(0);
  }, [track, scrollTo]);

  return {
    isTrackingMode,
    isAutoScrollingRef,
    scrollViewRef,
    scrollYRef,
    scrollTo,
    handleScrollViewScroll,
    handleScrollEnd,
    handleMoveToCurrent,
  };
}
