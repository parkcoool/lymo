import React, { memo, Ref, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeIn,
} from "react-native-reanimated";

import Skeleton from "@/shared/components/Skeleton";
import { colors } from "@/shared/constants/colors";
import { useTypingAnimation } from "@/shared/hooks/useTypingAnimation";

import { styles } from "./styles";

interface SentenceProps {
  sentence: string;
  translation?: string | null;
  active: boolean;
  ref?: Ref<View>;
  isCompleted?: boolean;
}

const Sentence = memo(
  ({ sentence, translation, active, ref, isCompleted = true }: SentenceProps) => {
    const progress = useSharedValue(active ? 1 : 0);
    const displayedTranslation = useTypingAnimation(translation, 10, !isCompleted);

    useEffect(() => {
      progress.value = withTiming(active ? 1 : 0, {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
      });
    }, [active, progress]);

    const animatedStyle = useAnimatedStyle(() => {
      const color = interpolateColor(
        progress.value,
        [0, 1],
        [colors.onBackgroundSubtle, colors.onBackground]
      );

      return { color };
    });

    return (
      <Animated.View
        style={styles.container}
        ref={ref}
        layout={LinearTransition.duration(300).easing(Easing.inOut(Easing.quad))}
      >
        <Animated.Text style={[styles.sentence, animatedStyle]}>{sentence}</Animated.Text>

        {/* 번역 스켈레톤 */}
        {translation === undefined && !isCompleted && (
          <Skeleton width="70%" height={12} opacity={0.4} />
        )}

        {/* 번역 텍스트 */}
        {displayedTranslation.length > 0 && (
          <Animated.Text
            style={[styles.translation, animatedStyle]}
            entering={FadeIn.duration(300)}
          >
            {displayedTranslation}
          </Animated.Text>
        )}
      </Animated.View>
    );
  }
);

Sentence.displayName = "Sentence";

export default Sentence;
