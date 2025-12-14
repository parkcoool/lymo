import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { Stack } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";

import Intro from "@/entities/player/ui/Intro";
import Lyrics from "@/entities/player/ui/Lyrics";
import Overview from "@/entities/player/ui/Overview";
import MoveToCurrent from "@/features/player/components/MoveToCurrent";
import useProcessLyrics from "@/features/player/hooks/useProcessLyrics";
import useTracking from "@/features/player/hooks/useTracking";
import Header from "@/shared/components/Header";
import { colors } from "@/shared/constants/colors";
import useDominantColorQuery from "@/shared/hooks/useDominantColorQuery";
import useYOffsetInWindow from "@/shared/hooks/useYOffsetInWindow";
import mixColors from "@/shared/utils/mixColors";

import { styles } from "./styles";

interface PlayerViewProps {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;

  /**
   * `track`과 `story`가 모두 완전히 로드되었는지 여부
   */
  isCompleted?: boolean;
}

export default function PlayerView({ track, story, isCompleted = true }: PlayerViewProps) {
  const { data: coverColor } = useDominantColorQuery(track?.albumArt);
  const headerBackgroundColor = useMemo(
    () => mixColors([coverColor ?? "#000000", "#000000CC"]),
    [coverColor]
  );

  // 현재 활성화된 문장의 y 좌표 (in window)
  const { y: currentY, measure, ref: currentRef } = useYOffsetInWindow();

  // 트래킹 관련 로직
  const {
    isTrackingMode,
    scrollViewRef,
    handleScrollViewScroll,
    handleScrollEnd,
    handleMoveToCurrent,
  } = useTracking({
    currentY,
    track,
  });

  // 처리된 가사 데이터
  const processedLyrics = useProcessLyrics({ story, track });

  // 스크롤뷰 스크롤 핸들러
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollViewScroll(event);
    measure();
  };

  return (
    <>
      <View style={[styles.wrapper, { backgroundColor: coverColor }]}>
        <ScrollView
          style={styles.content}
          ref={scrollViewRef}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={styles.topContent}>
            {/* 곡 정보 */}
            <Intro
              title={track?.title}
              artists={track?.artists}
              album={track?.album}
              albumArt={track?.albumArt}
              coverColor={coverColor}
              publishedAt={track?.publishedAt}
            />

            {/* 개요 */}
            <Overview overview={story?.overview} isCompleted={isCompleted} />
          </View>

          {/* 가사 */}
          {processedLyrics ? (
            <View collapsable={false}>
              <Lyrics
                activeSentenceRef={currentRef}
                lyrics={processedLyrics}
                lyricsProvider={story?.lyricsProvider}
                isCompleted={isCompleted}
              />
            </View>
          ) : (
            <ActivityIndicator
              style={{ marginTop: 50 }}
              size={60}
              color={colors.onBackgroundSubtle}
            />
          )}
        </ScrollView>

        {/* 현재 가사로 이동 */}
        {!isTrackingMode && (
          <MoveToCurrent activeSentenceY={currentY} onPress={handleMoveToCurrent} />
        )}
      </View>

      {/* 헤더 설정 */}
      <Stack.Screen
        options={{
          header: (props) => <Header {...props} backgroundColor={headerBackgroundColor} />,
        }}
      />
    </>
  );
}
