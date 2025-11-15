import React, { memo, Ref, useEffect, useRef } from "react";
import { View, Animated } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/constants/colors";

import { styles } from "./Sentence.styles";

interface SentenceProps {
  sentence: string;
  translation?: string | null;
  active: boolean;
  ref?: Ref<View>;
}

const Sentence = memo(({ sentence, translation, active, ref }: SentenceProps) => {
  const progress = useRef(new Animated.Value(0)).current;

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
      {translation === undefined && <Skeleton width="70%" height={16} opacity={0.4} />}

      {/* 번역 표시 */}
      {translation && (
        <Animated.Text style={[styles.translation, { color }]}>{translation}</Animated.Text>
      )}
    </View>
  );
});

Sentence.displayName = "Sentence";

export default Sentence;
