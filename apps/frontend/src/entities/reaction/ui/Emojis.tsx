import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
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

import useActiveBucketIndex from "../hooks/useActiveBucket";
import useReactionBucketsQuery from "../hooks/useReactionBucketsQuery";

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
  const { data: buckets } = useReactionBucketsQuery({ storyId });
  const activeBucketIndex = useActiveBucketIndex();

  const [queue, setQueue] = useState<{ id: string; emoji: string }[]>([]);

  useEffect(() => {
    if (activeBucketIndex === undefined || !buckets) return;
    const counts = buckets[activeBucketIndex]?.counts;
    if (!counts) return;

    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    if (totalCount > 15) {
      // TODO: 너무 많으면 개수 조절
    }

    const newEmojis = Object.entries(counts).flatMap(([emoji, count]) =>
      Array.from({ length: count }).map(() => emoji)
    );

    if (newEmojis.length === 0) return;

    let index = 0;
    const addEmoji = () => {
      setQueue((prev) => {
        const newQueue = [...prev];
        newQueue.unshift({ id: Crypto.randomUUID(), emoji: newEmojis[index] });
        index++;
        return newQueue;
      });

      // 5초 후에 큐에서 제거
      setTimeout(
        () =>
          setQueue((prev) => {
            const newQueue = [...prev];
            newQueue.pop();
            return newQueue;
          }),
        5000
      );
    };
    const interval = setInterval(addEmoji, 5000 / newEmojis.length);
    addEmoji();

    return () => clearInterval(interval);
  }, [activeBucketIndex, buckets]);

  return (
    <View style={styles.container} pointerEvents="none">
      {queue.map(({ id, emoji }) => (
        <FloatingEmoji key={id} emoji={emoji} />
      ))}
    </View>
  );
}
