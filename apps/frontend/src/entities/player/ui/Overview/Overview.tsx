import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import Skeleton from "@/shared/components/Skeleton";
import { useTypingAnimation } from "@/shared/hooks/useTypingAnimation";

import { styles } from "./styles";

interface OverviewProps {
  overview?: string;
  isCompleted?: boolean;
}

export default function Overview({ overview, isCompleted = true }: OverviewProps) {
  const [expanded, setExpanded] = useState(false);

  // 개요 문자열 타이핑 애니메이션 적용
  const displayedOverview = useTypingAnimation(overview, 0.5, !isCompleted);
  const expandable = displayedOverview.length > 0 && !expanded;

  const handleExpand = () => {
    if (!expandable) return;
    setExpanded(true);
  };

  return (
    <View style={styles.wrapper}>
      {/* 개요 */}
      <View style={{ height: expanded ? undefined : 192, overflow: "hidden" }}>
        {displayedOverview.length > 0 ? (
          <Text style={styles.overview} numberOfLines={expanded ? undefined : 8}>
            {displayedOverview}
          </Text>
        ) : (
          <View style={styles.overviewSkeletonContainer}>
            <Skeleton height={16} width="100%" opacity={0.4} />
            <Skeleton height={16} width="100%" opacity={0.4} />
            <Skeleton height={16} width="80%" opacity={0.4} />
            <Skeleton height={16} width="0%" opacity={0.4} />
            <Skeleton height={16} width="100%" opacity={0.4} />
            <Skeleton height={16} width="100%" opacity={0.4} />
            <Skeleton height={16} width="0%" opacity={0.4} />
            <Skeleton height={16} width="80%" opacity={0.4} />
            <Skeleton height={16} width="100%" opacity={0.4} />
          </View>
        )}
      </View>

      {/* 자세히 보기 버튼 */}
      <TouchableOpacity
        style={[styles.overviewButton, !expandable ? styles.invisible : null]}
        onPress={handleExpand}
        disabled={!expandable}
      >
        <MaterialIcons name={"expand-more"} size={20} style={styles.overviewButtonContent} />
        <Text style={styles.overviewButtonContent}>자세히 보기</Text>
      </TouchableOpacity>
    </View>
  );
}
