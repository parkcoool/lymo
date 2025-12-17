import { View } from "react-native";

import Skeleton from "@/shared/components/Skeleton";

import { styles } from "./styles";

export default function StoryInfoSkeleton() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        {/* 아바타 */}
        <Skeleton width={28} height={28} borderRadius={14} />

        {/* 이름 */}
        <Skeleton width={"50%"} opacity={0.5} />
      </View>

      <View style={styles.statContainer}>
        <Skeleton width={"100%"} opacity={0.5} height={45} />
      </View>
    </View>
  );
}
