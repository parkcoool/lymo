import type { LyricsDoc, ProviderDoc, TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { LyricsProvider } from "@lymo/schemas/shared";
import { Stack } from "expo-router";
import { useMemo, useRef } from "react";
import { ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import MoveToCurrent from "@/components/player/MoveToCurrent";
import ProviderInformation from "@/components/player/ProviderInformation";
import Summary from "@/components/player/Summary";
import TrackToCurrent from "@/components/player/TrackToCurrent";
import Header from "@/components/shared/Header";
import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import useYOffsetInWindow from "@/hooks/useActiveSentenceY";
import mixColors from "@/utils/blend";
import processLyrics from "@/utils/processLyrics";

import { useTracking } from "./Player.hooks";
import { styles } from "./Player.styles";

interface TrackPlayerProps {
  track: TrackDoc;
  lyrics: LyricsDoc["lyrics"];
  lyricsProvider: LyricsProvider;
  provider?: ProviderDoc;
  trackDetail: Omit<TrackDetailDoc, "lyricsProvider"> & { lyricsProvider?: LyricsProvider };
}

export default function PlayerContent({
  track,
  lyrics,
  lyricsProvider,
  provider,
  trackDetail,
}: TrackPlayerProps) {
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);
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
  const processedLyrics = useMemo(
    () =>
      processLyrics({
        rawLyrics: lyrics,
        lyricsSplitIndices: trackDetail.lyricsSplitIndices,
        translations: trackDetail.translations,
        paragraphSummaries: trackDetail.paragraphSummaries,
      }),
    [lyrics, trackDetail]
  );

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
            title={track.title}
            artist={track.artist}
            album={track.album}
            publishedAt={track.publishedAt}
            summary={trackDetail?.summary}
            coverUrl={track.coverUrl}
            coverColor={coverColor}
          />

          {/* 제공자 정보 */}
          {provider && <ProviderInformation provider={provider} />}

          {/* 가사 */}
          <Lyrics
            activeSentenceRef={currentRef}
            lyrics={processedLyrics}
            lyricsProvider={lyricsProvider}
          />
        </ScrollView>

        {/* 현재 가사로 이동 */}
        {!isTrackingMode && (
          <MoveToCurrent activeSentenceY={currentY} onPress={handleMoveToCurrent} />
        )}

        {/* 트래킹 모드 활성화 */}
        <TrackToCurrent isTrackingMode={isTrackingMode} onPress={handleMoveToCurrent} />
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
