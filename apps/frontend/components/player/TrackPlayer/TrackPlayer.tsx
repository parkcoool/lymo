import type { Track, TrackDetail } from "@lymo/schemas/shared";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";

import Lyrics from "@/components/player/Lyrics";
import MoveToCurrent from "@/components/player/MoveToCurrent";
import Summary from "@/components/player/Summary";
import useYOffsetInWindow from "@/hooks/useActiveSentenceY";

import TrackToCurrent from "../TrackToCurrent";

import { styles } from "./TrackPlayer.styles";

interface TrackPlayerProps {
  track: Track & TrackDetail;
  coverColor: string;
}

export default function TrackPlayer({ track, coverColor }: TrackPlayerProps) {
  // 트래킹 모드 활성화 여부
  const [isTrackingMode, setIsTrackingMode] = useState(true);

  // 자동 스크롤 중인지 여부 (사용자 스크롤과 구분하기 위함)
  const isAutoScrollingRef = useRef<boolean>(false);
  // 현재 활성화된 문장 View
  const currentRef = useRef<View>(null);
  // 스크롤뷰
  const scrollViewRef = useRef<ScrollView>(null);
  // 스크롤뷰의 스크롤 y 값
  const scrollYRef = useRef<number>(0);

  // 현재 활성화된 문장의 y 좌표 (in window)
  const currentY = useYOffsetInWindow(currentRef);

  // 스크롤 함수
  const scrollTo = useCallback(
    (y: number) => {
      if (isAutoScrollingRef.current || Math.abs(scrollYRef.current - y) < 5)
        return;

      isAutoScrollingRef.current = true;
      // console.log("auto scrolling started");
      scrollViewRef.current?.scrollTo({ y, x: 0, animated: true });
    },
    [isAutoScrollingRef]
  );

  // 스크롤뷰 스크롤 이벤트 핸들러
  const handleScrollViewScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;

    // 사용자가 직접 스크롤을 조작한 경우에만 트래킹 모드 비활성화
    if (isAutoScrollingRef.current || !isTrackingMode) return;

    setIsTrackingMode(false);
    // console.log("tracking mode deactivated");
  };

  // 스크롤 종료 이벤트 핸들러
  const handleScrollEnd = () => {
    if (!isAutoScrollingRef.current) return;
    isAutoScrollingRef.current = false;
    // console.log("auto scrolling ended");
  };

  // 현재 가사로 이동 이벤트 핸들러
  const handleMoveToCurrent = () => {
    scrollTo(scrollYRef.current + currentY - 200);
    setIsTrackingMode(true);
    // console.log("tracking mode activated");
  };

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
  }, [track.id, scrollTo]);

  return (
    <View style={[styles.wrapper, { backgroundColor: coverColor }]}>
      <ScrollView
        style={styles.content}
        ref={scrollViewRef}
        onScroll={handleScrollViewScroll}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {/* 곡 메타데이터 및 설명 */}
        <Summary
          coverUrl={track.coverUrl}
          title={track.title}
          artist={track.artist}
          album={track.album}
          publishedAt={track.publishedAt}
          summary={track.summary}
        />

        {/* 가사 */}
        <Lyrics activeSentenceRef={currentRef} lyrics={track.lyrics} />
      </ScrollView>

      {/* 현재 가사로 이동 */}
      {!isTrackingMode && (
        <MoveToCurrent
          activeSentenceY={currentY}
          onPress={handleMoveToCurrent}
        />
      )}

      {/* 트래킹 모드 활성화 */}
      <TrackToCurrent
        isTrackingMode={isTrackingMode}
        onPress={handleMoveToCurrent}
      />
    </View>
  );
}
