import { WordNote } from "@lymo/schemas/shared";
import React, { memo, Ref, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeIn,
} from "react-native-reanimated";

import { colors } from "@/shared/constants/colors";

import { styles } from "./styles";

interface SentenceProps {
  sentence: string;
  translation?: string | null;
  wordNote?: WordNote;
  active: boolean;
  ref?: Ref<View>;
}

const Sentence = memo(({ sentence, translation, wordNote, active, ref }: SentenceProps) => {
  const progress = useSharedValue(active ? 1 : 0);

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

  const sentenceContent = useMemo(() => {
    if (!wordNote?.word || !sentence.includes(wordNote.word)) {
      return sentence;
    }

    const word = wordNote.word;
    const index = sentence.indexOf(word);
    const before = sentence.substring(0, index);
    const after = sentence.substring(index + word.length);

    return (
      <>
        <Text>{before}</Text>
        <Text style={styles.highlight}>{word}</Text>
        <Text>{after}</Text>
      </>
    );
  }, [sentence, wordNote]);

  return (
    <View style={styles.container} ref={ref}>
      <Animated.Text style={[styles.sentence, animatedStyle]}>{sentenceContent}</Animated.Text>

      {wordNote && (
        <Animated.View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{wordNote.note}</Text>
        </Animated.View>
      )}

      <View style={styles.translationWrapper}>
        {/* 번역 텍스트 */}
        {translation && (
          <Animated.Text
            style={[styles.translation, animatedStyle]}
            entering={FadeIn.duration(300)}
          >
            {translation}
          </Animated.Text>
        )}
      </View>
    </View>
  );
});

Sentence.displayName = "Sentence";

export default Sentence;
