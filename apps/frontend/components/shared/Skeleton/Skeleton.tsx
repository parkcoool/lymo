import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { styles } from "./Skeleton.styles";

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  opacity = 0.7,
  style,
}: SkeletonProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const shimmerTranslate = useSharedValue(-1);
  const animatedOpacity = useSharedValue(0);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.ease,
      }),
      -1,
      false
    );

    // 0.5초 딜레이 후 0.3초 동안 페이드인
    animatedOpacity.value = withDelay(
      500,
      withTiming(0.8, {
        duration: 300,
        easing: Easing.ease,
      })
    );

    // opacity 및 shimmerTranslate는 안정적임
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value * containerWidth }],
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value * opacity,
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height, borderRadius },
        style,
        opacityStyle,
      ]}
      onLayout={handleLayout}
    >
      <Animated.View style={[styles.shimmerWrapper, animatedStyle]}>
        <LinearGradient
          colors={["#ffffff00", "#ffffffcc", "#ffffff00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </Animated.View>
  );
}
