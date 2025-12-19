import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { styles } from "./styles";

const DURATION_MS = 5000;

export default function Background() {
  return (
    <View style={styles.background}>
      <View style={styles.ringsContainer}>
        <Ring delay={0} />
        <Ring delay={DURATION_MS * (1 / 3)} />
        <Ring delay={DURATION_MS * (2 / 3)} />
      </View>
    </View>
  );
}

function Ring({ delay }: { delay: number }) {
  const scale = useSharedValue(0);
  const width = useSharedValue(6);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(3, {
          duration: DURATION_MS,
          easing: Easing.out(Easing.cubic),
        }),
        -1,
        false
      )
    );

    width.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, {
          duration: DURATION_MS,
          easing: Easing.out(Easing.cubic),
        }),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, {
          duration: DURATION_MS,
          easing: Easing.out(Easing.cubic),
        }),
        -1,
        false
      )
    );
  }, [delay, opacity, scale, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: width.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.ring, animatedStyle]} />;
}
