import { WordNote } from "@lymo/schemas/shared";
import React, { memo, Ref, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  interpolate,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { colors } from "@/shared/constants/colors";

import getHighlightColor from "../../utils/getHighlightColor";

import Content from "./Content";
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
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    });
  }, [active, progress]);

  const animatedSentenceStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.onBackgroundSubtle, colors.onBackground]
    );

    return { color };
  });

  const animatedTooltipStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.5, 1]);

    return { opacity };
  });

  return (
    <View style={styles.container} ref={ref}>
      {/* 원문 */}
      <Animated.Text style={[styles.sentence, animatedSentenceStyle]}>
        <Content sentence={sentence} wordNote={wordNote} />
      </Animated.Text>

      {/* 번역 */}
      <View style={styles.translationWrapper}>
        {/* 번역 텍스트 */}
        {translation && (
          <Animated.Text
            style={[styles.translation, animatedSentenceStyle]}
            entering={FadeIn.duration(300)}
          >
            {translation}
          </Animated.Text>
        )}
      </View>

      {/* 단어 해석 */}
      {wordNote && (
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(300)}>
          <Animated.View
            style={[
              styles.tooltip,
              { backgroundColor: `${getHighlightColor(wordNote.lyricIndex)}CC` },
              animatedTooltipStyle,
            ]}
          >
            <View style={styles.tooltipBackground}>
              <Text style={styles.wordNoteSource}>{wordNote.word}</Text>
              <Text style={styles.wordNote}>{wordNote.note}</Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
});

Sentence.displayName = "Sentence";

export default Sentence;
