import { useRef, useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import useCoverColor from "@/features/track/hooks/useCoverColor";

import { styles } from "./ActiveTrack.styles";

export default function ActiveTrack() {
  const animation = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get("window").width;

  const { track, isSynced } = useActiveTrackStore();
  const [copiedTrack, setCopiedTrack] = useState(track);
  const coverColor = useCoverColor(copiedTrack?.coverUrl ?? null) ?? "#FFFFFF";

  // track이 null이 아닐 때 copiedTrack을 업데이트
  useEffect(() => {
    if (track !== null) {
      setCopiedTrack(track);
    }
  }, [track]);

  useEffect(() => {
    Animated.spring(animation, {
      toValue: track === null ? 500 : 0,
      useNativeDriver: true,
    }).start();
  }, [track, animation]);

  return (
    <Animated.View
      style={[styles.root, { transform: [{ translateY: animation }] }]}
    >
      <LinearGradient
        colors={[`${coverColor}99`, `${coverColor}B3`]}
        style={[
          styles.wrapper,
          {
            width: windowWidth - 24,
          },
        ]}
      >
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
                source={{ uri: copiedTrack?.coverUrl ?? "" }}
                style={styles.cover}
              />

              {/* 메타데이터 */}
              <View style={styles.trackMetadata}>
                <Text style={styles.title} numberOfLines={1}>
                  {copiedTrack?.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {copiedTrack?.artist}
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
      </LinearGradient>

      {/* 하단 영역 */}
      <SafeAreaView edges={["bottom"]} />
    </Animated.View>
  );
}
