import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

import useEmojiQueue from "../hooks/useEmojiQueue";

import { styles } from "./styles";

const EMOJI_TIMEOUT_MS = 3000; // >= 2500

interface EmojisProps {
  storyId: string;
}

const FloatingEmoji = ({ emoji }: { emoji: string }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // 랜덤한 속도로 위로 올라가기
    const duration = EMOJI_TIMEOUT_MS + Math.random() * 2000;
    const distance = -(300 + Math.random() * 100);

    translateY.value = withTiming(distance, {
      duration,
      easing: Easing.linear,
    });

    // 랜덤하게 좌우로 둥둥 떠다니기
    const horizontalDistance = Math.random() * 40;
    const horizontalDuration = 1500 + Math.random() * 1500;

    translateX.value = withRepeat(
      withSequence(
        withTiming(horizontalDistance, {
          duration: horizontalDuration,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-horizontalDistance, {
          duration: horizontalDuration,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    // 0.5초 동안 나타나고, 대기 후 2초 동안 사라지기
    opacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withDelay(EMOJI_TIMEOUT_MS - 2500, withTiming(0, { duration: 2000 }))
    );
  }, [translateX, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.emojiWrapper, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </Animated.View>
  );
};

export default function Emojis({ storyId }: EmojisProps) {
  const queue = useEmojiQueue({ storyId });

  return (
    <View style={styles.container} pointerEvents="none">
      {queue.map(({ id, emoji }) => (
        <FloatingEmoji key={id} emoji={emoji} />
      ))}
    </View>
  );
}
