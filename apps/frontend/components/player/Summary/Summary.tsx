import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Image, Text, TouchableOpacity, type TextLayoutEvent } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import useWindowSize from "@/hooks/useWindowSize";
import { DeviceMedia } from "@/types/mediaModule";
import getTrackDetailString from "@/utils/getTrackDetailString";

import { styles } from "./Summary.styles";

interface SummaryProps {
  title?: string;
  artist?: string[];
  album?: string | null;
  albumArt?: string;
  coverColor?: string;
  publishedAt?: string | null;
  overview?: string;
}

export default function Summary(props: SummaryProps) {
  const { width: windowWidth } = useWindowSize();
  const [overviewLine, setOverviewLine] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // 디바이스에서 재생 중인 트랙 정보 병합
  const { trackSource } = useTrackSourceStore();
  const placeholderTrack: Partial<DeviceMedia> =
    trackSource?.from === "device" ? trackSource.track : {};
  const track = { ...props, ...placeholderTrack };

  const detailString = getTrackDetailString({
    artist: track.artist,
    album: track.album,
    publishedAt: track.publishedAt,
  });

  const handleOverviewTextLayout = (e: TextLayoutEvent) => {
    setOverviewLine(e.nativeEvent.lines.length);
  };

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.coverWrapper, { width: windowWidth, height: windowWidth }]}>
        {/* 커버 이미지 */}
        <Image source={{ uri: track.albumArt }} style={styles.cover} />

        {/* 그라데이션 오버레이 */}
        <LinearGradient
          style={styles.coverGradient}
          colors={["transparent", track.coverColor ?? "#000000"]}
        />
        <LinearGradient style={styles.coverGradient} colors={["transparent", "#000000CC"]} />

        {/* 곡 정보 */}
        <View style={styles.trackMetadata}>
          {track.title ? (
            <Text style={styles.title} numberOfLines={3}>
              {track.title}
            </Text>
          ) : (
            <Skeleton height={24} width="50%" />
          )}
          {detailString.length > 0 ? (
            <Text style={styles.details} numberOfLines={3}>
              {detailString}
            </Text>
          ) : (
            <Skeleton opacity={0.5} />
          )}
        </View>
      </View>

      {/* 요약 */}
      {track.overview && track.overview.length > 0 && (
        <Text style={styles.summary} numberOfLines={!expanded ? 8 : undefined}>
          {track.overview}
        </Text>
      )}

      {/* 요약이 8줄 이상일 때만 자세히 보기 버튼 노출 */}
      {overviewLine > 8 && !expanded && (
        <TouchableOpacity style={styles.summaryButton} onPress={handleExpand}>
          <MaterialIcons name={"expand-more"} size={20} style={styles.summaryButtonContent} />
          <Text style={styles.summaryButtonContent}>자세히 보기</Text>
        </TouchableOpacity>
      )}

      {/* 높이 측정을 위한 안 보이는 요약 */}
      <View pointerEvents="none" style={styles.invisible}>
        <Text style={styles.summary} onTextLayout={handleOverviewTextLayout}>
          {track.overview}
        </Text>
      </View>
    </View>
  );
}
