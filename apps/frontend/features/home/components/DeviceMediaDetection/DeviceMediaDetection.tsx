import { TouchableOpacity, View, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import useCoverColor from "@/features/track/hooks/useCoverColor";

import { styles } from "./DeviceMediaDetection.styles";
import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";

export default function DeviceMediaDetection() {
  const { data: track } = useDeviceMediaStore();
  const { isSynced, setIsSynced, setTrack } = useActiveTrackStore();

  const coverColor = useCoverColor(track?.albumArt ?? null) ?? "#FFFFFF";

  // 연동 버튼 핸들러
  const handleConnect = () => {
    if (!track) return;

    setIsSynced(true);
    setTrack({ ...track, coverUrl: track.albumArt ?? undefined });
  };

  // 연동 해제 버튼 핸들러
  const handleDisconnect = () => {
    setIsSynced(false);
    setTrack(null);
  };

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
          <Image source={{ uri: track.albumArt ?? "" }} style={styles.cover} />

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
          {/* 연동 및 연동 해제 버튼 */}
          <TouchableOpacity
            style={styles.button}
            onPress={isSynced ? handleDisconnect : handleConnect}
          >
            <MaterialIcons
              name={isSynced ? "close" : "sync"}
              size={20}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>
              {isSynced ? "기기와 연동 해제하기" : "기기와 연동하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
