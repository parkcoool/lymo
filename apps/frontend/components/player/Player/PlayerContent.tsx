import { StoryPreview, Track } from "@lymo/schemas/doc";
import { Stack } from "expo-router";
import { useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import MoveToCurrent from "@/components/player/MoveToCurrent";
import StartTrack from "@/components/player/StartTrack";
import Summary, { SummarySkeleton } from "@/components/player/Summary";
import Header from "@/components/shared/Header";
import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import useYOffsetInWindow from "@/hooks/useActiveSentenceY";
import useScrollPositionPreservation from "@/hooks/useScrollPositionPreservation";
import useTracking from "@/hooks/useTracking";
import groupLyricsIntoSections from "@/utils/groupLyricsIntoSections";
import mixColors from "@/utils/mixColors";

import { styles } from "./Player.styles";

interface PlayerContentProps {
  track: Track;
  storyPreview: StoryPreview;
}

export default function PlayerContent({ track, storyPreview }: PlayerContentProps) {
  const { data: coverColor } = useCoverColorQuery(track.albumArt);
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
    scrollYRef,
    handleScrollViewScroll,
    handleScrollEnd,
    handleMoveToCurrent,
  } = useTracking({
    currentY,
    track,
  });

  // 스크롤 위치 보존 로직
  const { contentRef: lyricsContainerRef, handleLayout: handleLyricsLayout } =
    useScrollPositionPreservation({
      scrollViewRef,
      scrollYRef,
    });

  // 처리된 가사 데이터
  const processedLyrics = useMemo(() => {
    // 해석 프리뷰 상태가 유효한지 검증
    if (storyPreview.status !== "IN_PROGRESS" && storyPreview.status !== "COMPLETED") return;

    // 가사 관련 데이터가 모두 존재하는지 검증
    const lyrics = track.lyrics[storyPreview.lyricsProvider];
    const { sectionBreaks, lyricTranslations, sectionNotes } = storyPreview;
    if (
      lyrics === undefined ||
      sectionBreaks === undefined ||
      lyricTranslations === undefined ||
      sectionNotes === undefined
    )
      return;

    // 가사 처리
    return groupLyricsIntoSections({ lyrics, sectionBreaks, lyricTranslations, sectionNotes });
  }, [track, storyPreview]);

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
          {track ? (
            <Summary
              title={track.title}
              artist={track.artists}
              album={track.album}
              publishedAt={track.publishedAt}
              summary={"overview" in storyPreview ? storyPreview.overview : undefined}
              albumArt={track.albumArt}
              coverColor={coverColor}
            />
          ) : (
            <SummarySkeleton />
          )}

          {/* 가사 */}
          {processedLyrics && (
            <View ref={lyricsContainerRef} onLayout={handleLyricsLayout} collapsable={false}>
              <Lyrics
                activeSentenceRef={currentRef}
                lyrics={processedLyrics}
                lyricsProvider={
                  "lyricsProvider" in storyPreview ? storyPreview.lyricsProvider : undefined
                }
              />
            </View>
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
