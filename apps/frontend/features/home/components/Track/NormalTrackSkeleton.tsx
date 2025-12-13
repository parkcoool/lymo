import { View } from "react-native";

import Skeleton from "@/features/shared/components/Skeleton";

import { styles } from "./NormalTrack.styles";

export default function NormalTrackSkeleton() {
  return (
    <View style={styles.wrapper}>
      <Skeleton width={60} height={60} borderRadius={8} />
      <View style={styles.textContainer}>
        <Skeleton width="100%" height={20} opacity={0.2} />
        <Skeleton width="70%" height={16} opacity={0.2} />
      </View>
    </View>
  );
}
