import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import Reanimated, { Easing, LinearTransition } from "react-native-reanimated";

import { useTypingAnimation } from "@/features/player/hooks/useTypingAnimation";
import { colors } from "@/features/shared/constants/colors";

import { styles } from "./Paragraph.styles";

interface ParagraphProps {
  note: string | null;
  active: boolean;
  children: React.ReactNode;
  isCompleted?: boolean;
}

const Paragraph = memo(({ note, active, children, isCompleted = true }: ParagraphProps) => {
  const parsedNote = note === "null" ? null : note;
  const displayedNote = useTypingAnimation(parsedNote, 10, !isCompleted);

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active && parsedNote !== null ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [parsedNote, active, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", `${colors.white}20`],
  });

  return (
    <Animated.View style={[styles.wrapper, { backgroundColor }]}>
      {/* 문단 해석 */}
      {parsedNote && (
        <Reanimated.View
          style={styles.noteWrapper}
          layout={LinearTransition.duration(300).easing(Easing.out(Easing.quad))}
        >
          <View style={styles.noteHeader}>
            <MaterialIcons name="lightbulb" size={20} style={styles.noteIcon} />
            <Text style={styles.noteTitle}>이해하기</Text>
          </View>

          <Text style={styles.note}>{displayedNote}</Text>
        </Reanimated.View>
      )}

      {/* 문장 */}
      <View style={styles.sentenceContainer}>{children}</View>
    </Animated.View>
  );
});

Paragraph.displayName = "Paragraph";

export default Paragraph;
