import { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  type TextLayoutEvent,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "./Summary.styles";

interface SummaryProps {
  coverUrl?: string;
  title?: string;
  artist?: string;
  album?: string | null;
  publishedAt?: string | null;
  summary?: string;
  coverColor?: string;
}

export default function Summary({
  coverUrl,
  title,
  artist,
  album,
  publishedAt,
  summary,
  coverColor,
}: SummaryProps) {
  const widowWidth = Dimensions.get("window").width;
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;
  const detailString = [artist, album, year].filter(Boolean).join(" • ");

  const [summaryLine, setSummaryLine] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleSummaryTextLayout = (e: TextLayoutEvent) => {
    setSummaryLine(e.nativeEvent.lines.length);
  };

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.coverWrapper, { width: widowWidth, height: widowWidth }]}
      >
        {/* 커버 이미지 */}
        <Image source={{ uri: coverUrl }} style={styles.cover} />

        {/* 그라데이션 오버레이 */}
        <LinearGradient
          style={styles.coverGradient}
          colors={["transparent", coverColor ?? "#000000"]}
        />
        <LinearGradient
          style={styles.coverGradient}
          colors={["transparent", "#000000AA"]}
        />

        {/* 곡 정보 */}
        <View style={styles.trackMetadata}>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <Text style={styles.details} numberOfLines={3}>
            {detailString}
          </Text>
        </View>
      </View>

      {/* 요약 */}
      {summary && summary.length > 0 && (
        <Text style={styles.summary} numberOfLines={!expanded ? 8 : undefined}>
          {summary}
        </Text>
      )}

      {/* 요약이 8줄 이상일 때만 자세히 보기 버튼 노출 */}
      {summaryLine > 8 && !expanded && (
        <TouchableOpacity style={styles.summaryButton} onPress={handleExpand}>
          <MaterialIcons
            name={"expand-more"}
            size={20}
            style={styles.summaryButtonContent}
          />
          <Text style={styles.summaryButtonContent}>자세히 보기</Text>
        </TouchableOpacity>
      )}

      {/* 높이 측정을 위한 안 보이는 요약 */}
      <View pointerEvents="none" style={styles.invisible}>
        <Text style={styles.summary} onTextLayout={handleSummaryTextLayout}>
          {summary}
        </Text>
      </View>
    </View>
  );
}
