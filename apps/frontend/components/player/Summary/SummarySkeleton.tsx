import { LinearGradient } from "expo-linear-gradient";
import { View, Image, Text } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import useCoverColorQuery from "@/hooks/useCoverColorQuery";
import useWindowSize from "@/hooks/useWindowSize";
import getTrackDetailString from "@/utils/getTrackDetailString";

import { styles } from "./Summary.styles";

interface SummaryProps {
  coverUrl: string;
  title: string;
  artist: string;
  album: string | null;
  publishedAt: string | null;
  summary: string;
}

export default function SummarySkeleton({
  coverUrl,
  title,
  artist,
  album,
  publishedAt,
}: Partial<SummaryProps>) {
  const { width: windowWidth } = useWindowSize();
  const { data: coverColor } = useCoverColorQuery(coverUrl);
  const detailString = getTrackDetailString({ artist, album, publishedAt });

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.coverWrapper,
          { width: windowWidth, height: windowWidth },
        ]}
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
          {title ? (
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
          ) : (
            <Skeleton />
          )}
          {detailString ? (
            <Text style={styles.details} numberOfLines={3}>
              {detailString}
            </Text>
          ) : (
            <Skeleton />
          )}
        </View>
      </View>

      {/* 곡 설명 */}
      <View style={styles.summarySkeleton}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </View>
    </View>
  );
}
