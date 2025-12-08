import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import useWindowSize from "@/hooks/useWindowSize";
import { DeviceMedia } from "@/types/mediaModule";
import getTrackDetailString from "@/utils/getTrackDetailString";

import { styles } from "./Summary.styles";

interface SummaryProps {
  title?: string;
  artists?: string[];
  album?: string | null;
  albumArt?: string;
  coverColor?: string;
  publishedAt?: string | null;
  overview?: string;
}

export default function Summary(props: SummaryProps) {
  const { width: windowWidth } = useWindowSize();
  const [expanded, setExpanded] = useState(false);

  // 디바이스에서 재생 중인 트랙 정보 병합
  const { trackSource } = useTrackSourceStore();
  const placeholderTrack: Partial<DeviceMedia> =
    trackSource?.from === "device" ? trackSource.track : {};
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([_, value]) => value !== undefined && value !== null)
  ) as Partial<SummaryProps>;
  const track = { ...placeholderTrack, ...filteredProps };

  // 개요 문자열 타이핑 애니메이션 적용
  const displayedOverview = useTypingAnimation(track.overview, 5);

  // 곡 메타데이터 문자열 생성
  const detailString = getTrackDetailString({
    artist: track.artists ?? track.artist,
    album: track.album,
    publishedAt: track.publishedAt,
  });

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.coverWrapper, { width: windowWidth, height: windowWidth }]}>
        {/* 커버 이미지 */}
        <Image
          source={{ uri: track.albumArt }}
          style={[styles.cover]}
          width={windowWidth}
          height={windowWidth}
          resizeMode="cover"
        />

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
          </View>
        )}
      </View>

      {/* 자세히 보기 상태가 아닐 때만 자세히 보기 버튼 노출 */}
      {displayedOverview.length > 0 && !expanded && (
        <TouchableOpacity style={styles.overviewButton} onPress={handleExpand}>
          <MaterialIcons name={"expand-more"} size={20} style={styles.overviewButtonContent} />
          <Text style={styles.overviewButtonContent}>자세히 보기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
