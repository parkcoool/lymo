import type { Track, TrackDetail } from "@lymo/schemas/shared";
import { useEffect, useRef } from "react";
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

import { styles } from "./TrackPlayer.styles";

interface TrackPlayerProps {
  track: Track & TrackDetail;
  coverColor: string;
}

export default function TrackPlayer({ track, coverColor }: TrackPlayerProps) {
  // 현재 활성화된 문장 View
  const currentRef = useRef<View>(null);
  // 스크롤뷰
  const scrollViewRef = useRef<ScrollView>(null);
  // 스크롤뷰의 스크롤 y 값
  const scrollYRef = useRef<number>(0);

  // 현재 활성화된 문장의 y 좌표 (in window)
  const currentY = useYOffsetInWindow(currentRef);

  // 스크롤 함수
  const scrollTo = (y: number) =>
    scrollViewRef.current?.scrollTo({ y, x: 0, animated: true });

  // 스크롤뷰 스크롤 이벤트 핸들러
  const handleScrollViewScroll = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  };

  // 현재 가사로 이동 이벤트 핸들러
  const handleMoveToCurrent = () => {
    scrollTo(scrollYRef.current + currentY - 400);
  };

  // 곡이 바뀌면 최상단으로 이동
  useEffect(() => {
    scrollTo(0);
  }, [track.id]);

  return (
    <View style={[styles.wrapper, { backgroundColor: coverColor }]}>
      <ScrollView
        style={styles.content}
        ref={scrollViewRef}
        onScroll={handleScrollViewScroll}
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
      <MoveToCurrent activeSentenceY={currentY} onPress={handleMoveToCurrent} />
    </View>
  );
}
