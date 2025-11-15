import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
  Animated,
  Easing,
} from "react-native";

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
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shimmerTranslate.setValue(-1);
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      })
    );
    shimmerLoop.start();

    // 0.5초 딜레이 후 0.3초 동안 페이드인 (최대 불투명도 0.8 * opacity)
    const fadeIn = Animated.sequence([
      Animated.delay(500),
      Animated.timing(animatedOpacity, {
        toValue: 0.8 * opacity,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]);
    fadeIn.start();

    // opacity 및 shimmerTranslate는 안정적임
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-containerWidth, containerWidth],
  });

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
        { opacity: animatedOpacity },
      ]}
      onLayout={handleLayout}
    >
      <Animated.View style={[styles.shimmerWrapper, { transform: [{ translateX }] }]}>
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
