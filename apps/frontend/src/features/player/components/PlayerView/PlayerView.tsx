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

import Header from "@/entities/layout/ui/Header";
import Intro from "@/entities/player/ui/Intro";
import Lyrics from "@/entities/player/ui/Lyrics";
import Overview from "@/entities/player/ui/Overview";
import StoryInfo from "@/entities/player/ui/StoryInfo";
import StoryInfoSkeleton from "@/entities/player/ui/StoryInfo/StoryInfoSkeleton";
import { colors } from "@/shared/constants/colors";
import useDominantColorQuery from "@/shared/hooks/useDominantColorQuery";
import useYOffsetInWindow from "@/shared/hooks/useYOffsetInWindow";
import mixColors from "@/shared/utils/mixColors";

import useIncreaseViews from "../../hooks/useIncreaseViews";
import useProcessLyrics from "../../hooks/useProcessLyrics";
import useTracking from "../../hooks/useTracking";
import MoveToCurrent from "../MoveToCurrent";

import { styles } from "./styles";

interface PlayerViewProps {
  track?: { id: string; data: Track };
  story?: { id: string; data: BaseStoryFields & Partial<GeneratedStoryFields> };

  /**
   * `track`과 `story`가 모두 완전히 로드되었는지 여부
   */
  isCompleted?: boolean;
}

export default function PlayerView({ track, story, isCompleted = true }: PlayerViewProps) {
  const { data: coverColor } = useDominantColorQuery(track?.data.albumArt);
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
    track: track?.data,
  });

  // 처리된 가사 데이터
  const processedLyrics = useProcessLyrics({ story: story?.data, track: track?.data });

  // 스크롤뷰 스크롤 핸들러
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScrollViewScroll(event);
    measure();
  };

  // 조회수 증가
  useIncreaseViews({ trackId: track?.id, storyId: story?.id });

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
              title={track?.data.title}
              artists={track?.data.artists}
              album={track?.data.album}
              albumArt={track?.data.albumArt}
              coverColor={coverColor}
              publishedAt={track?.data.publishedAt}
            />

            {/* 해석 정보 */}
            {story ? <StoryInfo story={story} /> : <StoryInfoSkeleton />}

            {/* 개요 */}
            <Overview overview={story?.data.overview} isCompleted={isCompleted} />
          </View>

          {/* 가사 */}
          {processedLyrics ? (
            <View collapsable={false}>
              <Lyrics
                activeSentenceRef={currentRef}
                lyrics={processedLyrics}
                lyricsProvider={story?.data.lyricsProvider}
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
