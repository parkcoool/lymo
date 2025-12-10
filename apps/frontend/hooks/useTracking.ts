import { Track } from "@lymo/schemas/doc";
import { useCallback, useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

import useWindowSize from "./useWindowSize";

interface UseTrackingParams {
  currentY: number;
  track?: Track;
}

export interface UseTrackingReturn {
  isTrackingMode: boolean;
  isAutoScrollingRef: React.RefObject<boolean>;
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollYRef: React.RefObject<number>;
  scrollTo: (y: number) => void;
  handleScrollViewScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollEnd: () => void;
  handleMoveToCurrent: () => void;
}

export default function useTracking({ currentY, track }: UseTrackingParams): UseTrackingReturn {
  const { height } = useWindowSize();

  // 트래킹 모드 활성화 여부
  const [isTrackingMode, setIsTrackingMode] = useState(false);

  // 자동 스크롤 중인지 여부 (사용자 스크롤과 구분하기 위함)
  const isAutoScrollingRef = useRef<boolean>(false);
  // 스크롤뷰
  const scrollViewRef = useRef<ScrollView>(null);
  // 스크롤뷰의 스크롤 y 값
  const scrollYRef = useRef<number>(0);
  // 현재 문장이 화면에 보이는 시간을 추적하기 위한 타이머
  const visibilityTimerRef = useRef<number | null>(null);

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

  // 현재 활성화된 문장이 화면에 보이면 0.7초 후 트래킹 모드 자동 활성화
  useEffect(() => {
    // 이미 트래킹 모드이거나 자동 스크롤 중이면 패스
    if (isTrackingMode || isAutoScrollingRef.current) return;

    const isVisible = currentY > height * 0.1 && currentY < height * 0.9;

    if (isVisible) {
      // 현재 문장이 화면에 보이면 1초 타이머 시작
      visibilityTimerRef.current = setTimeout(() => {
        setIsTrackingMode(true);
        // console.log("tracking mode auto-activated");
      }, 700);
    } else {
      // 현재 문장이 화면에서 벗어나면 타이머 취소
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = null;
      }
    }

    // 클린업
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
        visibilityTimerRef.current = null;
      }
    };
  }, [currentY, height, isTrackingMode]);

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
