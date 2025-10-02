import { TouchableOpacity, View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import useCoverColor from "@/features/track/hooks/useCoverColor";

import { styles } from "./DeviceMediaDetection.styles";

export default function DeviceMediaDetection() {
  const { data: track } = useDeviceMediaStore();
  const coverUrl = track?.albumArt
    ? "data:image/png;base64," + track.albumArt
    : null;

  const coverColor = useCoverColor(coverUrl) ?? "#FFFFFF";

  if (!track) {
    return null;
  }

  return (
    <LinearGradient
      colors={[`${coverColor}99`, `${coverColor}B3`]}
      style={[styles.wrapper]}
    >
      {/* 닫기 버튼 */}
      <TouchableOpacity style={styles.closeButton}>
        <MaterialIcons name="close" size={24} style={styles.closeIcon} />
      </TouchableOpacity>

      <View style={styles.overlay}>
        {/* 곡 정보 */}
        <View style={styles.track}>
          {/* 커버 이미지 */}
          <Image source={{ uri: coverUrl ?? "" }} style={styles.cover} />

          {/* 메타데이터 */}
          <View style={styles.trackMetadata}>
            <Text style={styles.title} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>
        </View>

        {/* 푸터 */}
        <View style={styles.footer}>
          <View style={styles.description}>
            <MaterialIcons name="cast" size={20} style={styles.castIcon} />
            <Text style={styles.descriptionText}>
              기기에서 재생 중인 곡을 감지했습니다.
            </Text>
          </View>

          {/* 재생 버튼 */}
          <TouchableOpacity style={styles.playButton}>
            <MaterialIcons
              name="play-circle"
              size={20}
              style={styles.playIcon}
            />
            <Text style={styles.playButtonText}>음악 감상하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
