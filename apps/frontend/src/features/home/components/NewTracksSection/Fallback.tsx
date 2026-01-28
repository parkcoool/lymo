import { View } from "react-native";

import { CompactTrackSkeleton } from "@/entities/home/ui/CompactTrack";

import { styles } from "./styles";

export default function Fallback() {
  return (
    <View style={styles.sectionContent}>
      <CompactTrackSkeleton />
      <CompactTrackSkeleton />
      <CompactTrackSkeleton />
      <CompactTrackSkeleton />
    </View>
  );
}
