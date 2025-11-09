import { ScrollView, View, Text } from "react-native";

import useCoverColorQuery from "@/hooks/useCoverColorQuery";
import Summary from "@/components/player/Summary";
import Lyrics from "@/components/player/Lyrics";
import useDeviceTrackQuery from "@/hooks/useDeviceTrackQuery";

export default function DeviceTrackPlayer() {
  const { data: track } = useDeviceTrackQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

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
      >
        {/* 곡 메타데이터 및 설명 */}
        <Summary
          coverUrl={track.coverUrl}
          title={track.title}
          artist={track.artist}
          album={track.album}
          publishedAt={track.publishedAt}
          summary={track.summary}
          coverColor={coverColor}
        />

        {/* 가사 */}
        <Lyrics lyrics={track.lyrics} />
      </ScrollView>
    </View>
  );
}
