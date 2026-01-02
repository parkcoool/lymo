import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { useMemo } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, View } from "react-native";
import Animated, { FadeIn, LayoutAnimationConfig } from "react-native-reanimated";

import Intro from "@/entities/player/ui/Intro";
import Lyrics from "@/entities/player/ui/Lyrics";
import Overview from "@/entities/player/ui/Overview";
import StoryInfo from "@/entities/player/ui/StoryInfo";
import StoryInfoSkeleton from "@/entities/player/ui/StoryInfo/StoryInfoSkeleton";
import Emojis from "@/entities/reaction/ui";
import useDominantColorQuery from "@/shared/hooks/useDominantColorQuery";
import useWindowSize from "@/shared/hooks/useWindowSize";
import useYOffsetInWindow from "@/shared/hooks/useYOffsetInWindow";
import { useSyncStore } from "@/shared/models/syncStore";
import mixColors from "@/shared/utils/mixColors";

import useIncreaseViews from "../../hooks/useIncreaseViews";
import useProcessLyrics from "../../hooks/useProcessLyrics";
import useTracking from "../../hooks/useTracking";
import MoveToCurrent from "../MoveToCurrent";
import ReactionTrigger from "../ReactionTrigger";

import HeaderConfig from "./HeaderConfig";
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

  const { height } = useWindowSize();
  const { isSynced } = useSyncStore();

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

  // 렌더링 여부 결정
  const shouldShowMoveToCurrent =
    !isTrackingMode && (currentY < 0 || currentY + 100 > height) && isSynced;
  const shouldShowReactionTrigger = !!story?.id && isSynced && isCompleted;

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
            {story ? (
              <Animated.View entering={FadeIn.duration(300)}>
                <StoryInfo story={story} track={track} isCompleted={isCompleted} />
              </Animated.View>
            ) : (
              <StoryInfoSkeleton />
            )}

            {/* 개요 */}
            <Overview overview={story?.data.overview} isCompleted={isCompleted} />
          </View>

          {/* 가사 */}
          {processedLyrics && (
            <Animated.View entering={FadeIn.duration(300)}>
              <Lyrics
                activeSentenceRef={currentRef}
                lyrics={processedLyrics}
                lyricsProvider={story?.data.lyricsProvider}
                isCompleted={isCompleted}
              />
            </Animated.View>
          )}
        </ScrollView>

        <LayoutAnimationConfig skipEntering>
          {/* 현재 가사로 이동 */}
          {shouldShowMoveToCurrent && (
            <MoveToCurrent
              activeSentenceY={currentY}
              onPress={handleMoveToCurrent}
              height={height}
            />
          )}

          {/* 반응 트리거 */}
          {shouldShowReactionTrigger && <ReactionTrigger storyId={story.id} />}

          {story && <Emojis storyId={story.id} />}
        </LayoutAnimationConfig>
      </View>

      {/* 헤더 설정 */}
      <HeaderConfig backgroundColor={headerBackgroundColor} />
    </>
  );
}
