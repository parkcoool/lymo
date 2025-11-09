import { TouchableOpacity, View, Image, Text } from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import useCoverColor from "@/hooks/useCoverColor";

import { styles } from "./DeviceMediaDetection.styles";

export default function DeviceMediaDetection() {
  const { setTrackSource } = useTrackSourceStore();
  const { deviceMedia } = useDeviceMediaStore();
  const { isSynced, setIsSynced } = useSyncStore();

  const coverColor = useCoverColor(deviceMedia?.coverUrl ?? null);

  // 연동 버튼 핸들러
  const handleConnect = () => {
    if (!deviceMedia) return;
    setIsSynced(true);
    setTrackSource({ from: "device", track: deviceMedia });
    router.push("/player");
  };

  // 연동 해제 버튼 핸들러
  const handleDisconnect = () => {
    setIsSynced(false);
  };

  if (!deviceMedia) {
    return null;
  }

  return (
    <LinearGradient
      colors={[`${coverColor}99`, `${coverColor}B3`]}
      style={[styles.wrapper]}
    >
      <View style={styles.overlay}>
        {/* 닫기 버튼 */}
        <TouchableOpacity style={styles.closeButton}>
          <MaterialIcons name="close" size={24} style={styles.closeIcon} />
        </TouchableOpacity>

        <View style={styles.header}>
          <MaterialIcons
            name="audiotrack"
            size={16}
            style={styles.headerIcon}
          />
          <Text style={styles.headerText}>기기에서 재생 중인 미디어</Text>
        </View>

        {/* 곡 정보 */}
        <Link href={"/player"} disabled={!isSynced}>
          <TouchableOpacity style={styles.track} disabled={!isSynced}>
            {/* 커버 이미지 */}
            <Image
              source={{ uri: deviceMedia.coverUrl ?? "" }}
              style={styles.cover}
            />

            {/* 메타데이터 */}
            <View style={styles.trackMetadata}>
              <Text style={styles.title} numberOfLines={1}>
                {deviceMedia.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {deviceMedia.artist}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

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
