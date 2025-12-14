import { LinearGradient } from "expo-linear-gradient";
import { View, Image, Text } from "react-native";

import getMetadataString from "@/entities/track/utils/getTrackDetailString";
import Skeleton from "@/shared/components/Skeleton";
import useWindowSize from "@/shared/hooks/useWindowSize";

import useMergedTrack from "../../hooks/useMergedTrack";

import { styles } from "./styles";

interface IntroProps {
  title?: string;
  artists?: string[];
  album?: string | null;
  albumArt?: string;
  coverColor?: string;
  publishedAt?: string | null;
}

export default function Intro({ coverColor, ...prop }: IntroProps) {
  const { width: windowWidth } = useWindowSize();

  // 디바이스에서 재생 중인 트랙 정보 병합
  const mergedTrack = useMergedTrack(prop);

  // 곡 메타데이터 문자열 생성
  const metadataString = getMetadataString({
    artist: mergedTrack.artists,
    album: mergedTrack.album,
    publishedAt: mergedTrack.publishedAt,
  });

  return (
    <View style={[styles.wrapper, { width: windowWidth, height: windowWidth }]}>
      {/* 커버 이미지 */}
      <Image
        source={{ uri: mergedTrack.albumArt }}
        style={[styles.cover]}
        width={windowWidth}
        height={windowWidth}
        resizeMode="cover"
      />

      {/* 그라데이션 오버레이 */}
      <LinearGradient
        style={styles.coverGradient}
        colors={["transparent", coverColor ?? "#000000"]}
      />
      <LinearGradient style={styles.coverGradient} colors={["transparent", "#000000CC"]} />

      {/* 곡 정보 */}
      <View style={styles.infoContainer}>
        {mergedTrack.title ? (
          <Text style={styles.title} numberOfLines={3}>
            {mergedTrack.title}
          </Text>
        ) : (
          <Skeleton height={24} width="50%" />
        )}

        {metadataString.length > 0 ? (
          <Text style={styles.metadata} numberOfLines={3}>
            {metadataString}
          </Text>
        ) : (
          <Skeleton opacity={0.5} />
        )}
      </View>
    </View>
  );
}
