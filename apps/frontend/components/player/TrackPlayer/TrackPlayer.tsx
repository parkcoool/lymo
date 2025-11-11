import type { Track, TrackDetail } from "@lymo/schemas/shared";
import { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import Summary from "@/components/player/Summary";

interface TrackPlayerProps {
  track: Track & TrackDetail;
  coverColor: string;
}

export default function TrackPlayer({ track, coverColor }: TrackPlayerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // 곡이 바뀌면 최상단으로 스크롤
  useEffect(
    () => scrollViewRef.current?.scrollTo({ y: 0, x: 0, animated: true }),
    [track.id]
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: coverColor,
      }}
    >
      <ScrollView
        style={{
          flexDirection: "column",
          flex: 1,
          backgroundColor: "#000000AA",
          paddingBottom: 12,
        }}
        ref={scrollViewRef}
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
        <Lyrics lyrics={track.lyrics} />
      </ScrollView>
    </View>
  );
}
