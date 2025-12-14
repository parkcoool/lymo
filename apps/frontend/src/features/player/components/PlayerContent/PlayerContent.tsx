import { Redirect } from "expo-router";
import { View } from "react-native";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";

import FromDevice from "./FromDevice";
import FromManual from "./FromManual";
import { styles } from "./styles";

export default function PlayerContent() {
  const { trackSource } = useTrackSourceStore();

  // 활성화된 곡이 없으면 홈으로 리다이렉트
  if (!trackSource) return <Redirect href="/" />;

  return (
    <View style={styles.container}>
      {trackSource.from === "manual" && (
        <FromManual track={{ id: trackSource.track.id, data: trackSource.track }} />
      )}
      {trackSource.from === "device" && (
        <FromDevice
          title={trackSource.track.title}
          artist={trackSource.track.artist}
          durationInSeconds={trackSource.track.duration}
        />
      )}
    </View>
  );
}
