import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { useDeviceMediaStore } from "@/entities/deviceMedia/models/deviceMediaStore";
import Header from "@/entities/layout/ui/Header";
import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import { useSyncStore } from "@/shared/models/syncStore";

import PlayerView from "../PlayerView";

import FromDevice from "./FromDevice";
import FromManual from "./FromManual";
import { styles } from "./styles";

export default function PlayerPage() {
  const { trackSource, setTrackSource } = useTrackSourceStore();
  const { deviceMedia } = useDeviceMediaStore();
  const { setIsSynced } = useSyncStore();

  // trackSource가 없으면 deviceMedia로 자동 설정
  useEffect(() => {
    if (trackSource || !deviceMedia) return;
    setIsSynced(true);
    setTrackSource({ from: "device", track: deviceMedia });
  }, [trackSource, deviceMedia, setIsSynced, setTrackSource]);

  return (
    <>
      {!trackSource ? (
        // trackSource가 없는 경우
        <PlayerView />
      ) : (
        // trackSource가 있는 경우
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
      )}

      <Stack.Screen
        options={{
          headerTransparent: true,
          contentStyle: { backgroundColor: "transparent" },
          header: (props) => <Header {...props} avatar={false} />,
        }}
      />
    </>
  );
}
