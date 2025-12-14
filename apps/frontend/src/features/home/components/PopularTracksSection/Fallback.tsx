import { View } from "react-native";

import { NormalTrackSkeleton } from "@/entities/home/ui/NormalTrack";

import { styles } from "./styles";

export default function Fallback() {
  return (
    <View style={styles.skeletonColumn}>
      <View style={styles.skeletonRow}>
        <NormalTrackSkeleton />
        <NormalTrackSkeleton />
      </View>
      <View style={styles.skeletonRow}>
        <NormalTrackSkeleton />
        <NormalTrackSkeleton />
      </View>
      <View style={styles.skeletonRow}>
        <NormalTrackSkeleton />
        <NormalTrackSkeleton />
      </View>
      <View style={styles.skeletonRow}>
        <NormalTrackSkeleton />
        <NormalTrackSkeleton />
      </View>
    </View>
  );
}
