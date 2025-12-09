import { StoryRequest } from "@lymo/schemas/doc";
import React, { memo, Ref, useEffect, useRef } from "react";
import { View, Animated } from "react-native";

import Skeleton from "@/components/shared/Skeleton";
import { colors } from "@/constants/colors";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

import { styles } from "./Sentence.styles";

interface SentenceProps {
  sentence: string;
  translation?: string | null;
  active: boolean;
  ref?: Ref<View>;
  status?: StoryRequest["status"];
}

const Sentence = memo(({ sentence, translation, active, ref, status }: SentenceProps) => {
  const progress = useRef(new Animated.Value(0)).current;
  const displayedTranslation = useTypingAnimation(translation, 10, status === "IN_PROGRESS");

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
      {translation === undefined && (status === "PENDING" || status === "IN_PROGRESS") && (
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
});

Sentence.displayName = "Sentence";

export default Sentence;
