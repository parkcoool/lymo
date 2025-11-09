import { ScrollView, View } from "react-native";

import Lyrics from "@/components/player/Lyrics";
import Summary from "@/components/player/Summary";
import useCoverColorQuery from "@/hooks/useCoverColorQuery";
import useDeviceTrackQuery from "@/hooks/useDeviceTrackQuery";

export default function DeviceTrackPlayer() {
  const { data: track, error } = useDeviceTrackQuery();
  const { data: coverColor } = useCoverColorQuery(track.coverUrl);

  if (error) throw error;

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
        />

        {/* 가사 */}
        <Lyrics lyrics={track.lyrics} />
      </ScrollView>
    </View>
  );
}
