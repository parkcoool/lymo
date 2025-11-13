import type { LyricsDoc, TrackDetailDoc, TrackDoc } from "@lymo/schemas/doc";
import { useRef } from "react";
import { ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import MoveToCurrent from "@/components/player/MoveToCurrent";
import Summary from "@/components/player/Summary";
import TrackToCurrent from "@/components/player/TrackToCurrent";
import useYOffsetInWindow from "@/hooks/useActiveSentenceY";
import useCoverColorQuery from "@/hooks/useCoverColorQuery";

import { useTracking } from "./TrackPlayer.hooks";
import { styles } from "./TrackPlayer.styles";

interface TrackPlayerProps {
  track: TrackDoc;
  lyrics: LyricsDoc;
  trackDetail?: TrackDetailDoc;
}

export default function TrackPlayer({ track, lyrics, trackDetail }: TrackPlayerProps) {
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

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
    trackId: track.id,
  });

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
        <MoveToCurrent activeSentenceY={currentY} onPress={handleMoveToCurrent} />
      )}

      {/* 트래킹 모드 활성화 */}
      <TrackToCurrent isTrackingMode={isTrackingMode} onPress={handleMoveToCurrent} />
    </View>
  );
}
