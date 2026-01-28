import React, { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  Easing,
} from "react-native-reanimated";

import { colors } from "@/shared/constants/colors";

import { styles } from "./styles";

interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}

export default function Switch({
  value,
  onValueChange,
  disabled = false,
  activeColor = colors.onSurface,
  inactiveColor = `${colors.onSurface}80`,
}: SwitchProps) {
  const switchAnimation = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    switchAnimation.value = withTiming(value ? 1 : 0, {
      duration: 200,
      easing: Easing.inOut(Easing.quad),
    });
  }, [value, switchAnimation]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      switchAnimation.value,
      [0, 1],
      [inactiveColor, activeColor]
    );

    return {
      backgroundColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = switchAnimation.value * 24;

    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange?.(!value);
    }
  };

  const content = (
    <Animated.View style={[styles.track, trackAnimatedStyle]}>
      <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
    </Animated.View>
  );

  if (onValueChange)
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={[styles.container, disabled && { opacity: 0.5 }]}
      >
        {content}
      </Pressable>
    );

  return <View style={[styles.container, disabled && { opacity: 0.5 }]}>{content}</View>;
}
