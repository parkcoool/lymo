import React, { memo, Ref, useEffect, useRef } from "react";
import { View, Animated } from "react-native";

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
    const progress = useRef(new Animated.Value(0)).current;
    const displayedTranslation = useTypingAnimation(translation, 10, !isCompleted);

    useEffect(() => {
      Animated.timing(progress, {
        toValue: active ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [active, progress]);

    const color = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.onBackgroundSubtle, colors.onBackground],
    });

    return (
      <View style={styles.container} ref={ref}>
        <Animated.Text style={[styles.sentence, { color }]}>{sentence}</Animated.Text>
        {/* 번역 스켈레톤 */}
        {translation === undefined && !isCompleted && (
          <Skeleton width="70%" height={16} opacity={0.4} />
        )}

        {/* 번역 텍스트 */}
        {displayedTranslation.length > 0 && (
          <Animated.Text style={[styles.translation, { color }]}>
            {displayedTranslation}
          </Animated.Text>
        )}
      </View>
    );
  }
);

Sentence.displayName = "Sentence";

export default Sentence;
