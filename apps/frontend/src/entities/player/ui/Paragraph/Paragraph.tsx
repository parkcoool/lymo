import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Easing,
  LinearTransition,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { useSettingStore } from "@/entities/setting/models/settingStore";
import { colors } from "@/shared/constants/colors";
import { useTypingAnimation } from "@/shared/hooks/useTypingAnimation";

import { styles } from "./styles";

interface ParagraphProps {
  note: string | null;
  active: boolean;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const Paragraph = memo(({ note, active, children, isCompleted = true }: ParagraphProps) => {
  const { setting } = useSettingStore();

  const parsedNote = note === "null" ? null : note;
  const displayedNote = useTypingAnimation(parsedNote, 10, !isCompleted);

  const progress = useSharedValue(active && parsedNote !== null ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active && parsedNote !== null ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.quad),
    });
  }, [parsedNote, active, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", `${colors.white}20`]
    );

    return { backgroundColor };
  });

  return (
    <Animated.View
      style={[styles.wrapper, animatedStyle]}
      layout={LinearTransition.duration(300).easing(Easing.inOut(Easing.quad))}
    >
      {/* 문단 해석 */}
      <Animated.View
        style={styles.noteWrapper}
        layout={LinearTransition.duration(300).easing(Easing.inOut(Easing.quad))}
      >
        {setting.showSectionNotes && parsedNote && (
          <Animated.View
            style={styles.noteContent}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <View style={styles.noteHeader}>
              <MaterialIcons name="lightbulb" size={20} style={styles.noteIcon} />
              <Text style={styles.noteTitle}>이해하기</Text>
            </View>

            <Text style={styles.note}>{displayedNote}</Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* 문장 */}
      <Animated.View
        style={styles.sentenceContainer}
        layout={LinearTransition.duration(300).easing(Easing.inOut(Easing.quad))}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
});

Paragraph.displayName = "Paragraph";

export default Paragraph;
