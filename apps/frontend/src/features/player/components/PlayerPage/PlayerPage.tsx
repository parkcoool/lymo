import { View } from "react-native";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";

import PlayerView from "../PlayerView";

import FromDevice from "./FromDevice";
import FromManual from "./FromManual";
import { styles } from "./styles";

export default function PlayerPage() {
  const { trackSource } = useTrackSourceStore();

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
              durationInSeconds={trackSource.track.durationInSeconds}
            />
          )}
        </View>
      )}
    </>
  );
}
