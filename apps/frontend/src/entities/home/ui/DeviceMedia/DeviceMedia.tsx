import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { TouchableOpacity, View, Image, Text } from "react-native";

import { useTrackSourceStore } from "@/entities/player/models/trackSourceStore";
import getMetadataString from "@/entities/track/utils/getTrackDetailString";
import { colors } from "@/shared/constants/colors";
import { useSyncStore } from "@/shared/models/syncStore";
import { DeviceMedia as DeviceMediaType } from "@/shared/types/DeviceMedia";

import { styles } from "./styles";

interface DeviceMediaProps {
  deviceMedia: DeviceMediaType;
}

export default function DeviceMedia({ deviceMedia }: DeviceMediaProps) {
  const { setTrackSource } = useTrackSourceStore();
  const { isSynced, setIsSynced } = useSyncStore();

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

  // 감상 버튼 핸들러
  const handleListen = () => {
    if (!deviceMedia) return;
    setTrackSource({ from: "device", track: deviceMedia });
    router.push("/player");
  };

  // 미디어가 감지되었을 때
  return (
    <View style={styles.wrapper}>
      <View style={[styles.coverWrapper]}>
        {/* 커버 이미지 */}
        <Image source={{ uri: deviceMedia.albumArt }} style={styles.cover} />

        {/* 그라데이션 오버레이 */}
        <LinearGradient style={styles.coverGradient} colors={["transparent", colors.black]} />

        {/* 곡 정보 */}
        <View style={styles.trackMetadata}>
          {/* 정보 */}
          <View style={styles.information}>
            <MaterialIcons name="audiotrack" size={16} style={styles.informationIcon} />
            <Text style={styles.informationText}>기기에서 재생 중인 미디어</Text>
          </View>

          <Text style={styles.title} numberOfLines={3}>
            {deviceMedia.title}
          </Text>
          <Text style={styles.details} numberOfLines={3}>
            {getMetadataString({ artist: deviceMedia.artist, album: deviceMedia.album })}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {/* 연동 및 연동 해제 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={isSynced ? handleDisconnect : handleConnect}
        >
          <MaterialIcons name={isSynced ? "close" : "sync"} size={20} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{isSynced ? "연동 해제하기" : "기기와 연동하기"}</Text>
        </TouchableOpacity>

        {/* 감상 버튼 */}
        {isSynced && (
          <TouchableOpacity style={styles.button} onPress={handleListen}>
            <MaterialIcons name="music-note" size={20} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>감상하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
