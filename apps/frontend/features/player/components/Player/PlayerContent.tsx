import { BaseStoryFields, GeneratedStoryFields, Track } from "@lymo/schemas/doc";
import { Stack } from "expo-router";
import { useMemo, useRef } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import Lyrics from "@/features/player/components/Lyrics";
import MoveToCurrent from "@/features/player/components/MoveToCurrent";
import Summary from "@/features/player/components/Summary";
import useYOffsetInWindow from "@/features/player/hooks/useActiveSentenceY";
import useCoverColorQuery from "@/features/player/hooks/useCoverColorQuery";
import useProcessLyrics from "@/features/player/hooks/useProcessLyrics";
import useTracking from "@/features/player/hooks/useTracking";
import Header from "@/features/shared/components/Header";
import { colors } from "@/features/shared/constants/colors";
import mixColors from "@/utils/mixColors";

import { styles } from "./Player.styles";

interface PlayerContentProps {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;
  isCompleted?: boolean;
}

export default function PlayerContent({ track, story, isCompleted = true }: PlayerContentProps) {
  const { data: coverColor } = useCoverColorQuery(track?.albumArt);
  const headerBackgroundColor = useMemo(
    () => mixColors([coverColor ?? "#000000", "#000000CC"]),
    [coverColor]
  );

  // 현재 활성화된 문장 View
  const currentRef = useRef<View>(null);

  // 현재 활성화된 문장의 y 좌표 (in window)
  const currentY = useYOffsetInWindow(currentRef);

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

  return (
    <>
      <View style={[styles.wrapper, { backgroundColor: coverColor }]}>
        <ScrollView
          style={styles.content}
          ref={scrollViewRef}
          onScroll={handleScrollViewScroll}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {/* 곡 메타데이터 및 설명 */}
          <Summary
            title={track?.title}
            artists={track?.artists}
            album={track?.album}
            publishedAt={track?.publishedAt}
            overview={story?.overview}
            albumArt={track?.albumArt}
            coverColor={coverColor}
            isCompleted={isCompleted}
          />

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
