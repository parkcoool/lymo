import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

import { useDeviceMediaStore } from "@/contexts/useDeviceMediaStore";

import { styles } from "./ActiveTrack.styles";

export default function ActiveTrack() {
  const windowWidth = Dimensions.get("window").width;

  const { data: track } = useDeviceMediaStore();
  const isSynced = true; // TODO: 기기 연동 상태

  if (!track) return null;

  return (
    <View style={styles.root}>
      <View style={[styles.wrapper, { width: windowWidth - 24 }]}>
        <View style={styles.overlay}>
          {/* 왼쪽 */}
          <View style={styles.left}>
            {/* 연동 여부 표시 */}
            <View style={styles.syncIndicator}>
              <MaterialIcons name="cast" size={16} style={styles.syncIcon} />
              {isSynced && (
                <Text style={styles.syncText}>기기에서 재생 중인 곡</Text>
              )}
            </View>

            {/* 곡 정보 */}
            <View style={styles.track}>
              {/* 커버 이미지 */}
              <Image
                source={{ uri: "data:image/png;base64," + track.albumArt }}
                style={styles.cover}
              />

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
          </View>

          {/* 확장 버튼 */}
          <TouchableOpacity style={styles.expandButton}>
            <MaterialIcons
              name="keyboard-arrow-up"
              size={32}
              style={styles.expandIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 영역 */}
      <SafeAreaView edges={["bottom"]} />
    </View>
  );
}
