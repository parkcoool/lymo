import { BaseStoryFields, GeneratedStoryFields, StoryRequest, Track } from "@lymo/schemas/doc";
import { Stack } from "expo-router";
import { useMemo, useRef } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import MoveToCurrent from "@/components/player/MoveToCurrent";
import StartTrack from "@/components/player/StartTrack";
import Summary from "@/components/player/Summary";
import Header from "@/components/shared/Header";
import { colors } from "@/constants/colors";
import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import useYOffsetInWindow from "@/hooks/useActiveSentenceY";
import useProcessLyrics from "@/hooks/useProcessLyrics";
import useTracking from "@/hooks/useTracking";
import mixColors from "@/utils/mixColors";

import { styles } from "./Player.styles";

interface PlayerContentProps {
  track?: Track;
  story?: BaseStoryFields & Partial<GeneratedStoryFields>;
  status?: StoryRequest["status"];
}

export default function PlayerContent({ track, story, status }: PlayerContentProps) {
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
            status={status}
          />

          {/* 가사 */}
          {processedLyrics ? (
            <View collapsable={false}>
              <Lyrics
                activeSentenceRef={currentRef}
                lyrics={processedLyrics}
                lyricsProvider={story?.lyricsProvider}
                status={status}
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

        {/* 트래킹 모드 활성화 */}
        <StartTrack isTrackingMode={isTrackingMode} onPress={handleMoveToCurrent} />
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
