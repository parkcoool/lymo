import { StoryRequest } from "@lymo/schemas/doc";
import { memo, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import Reanimated, { Easing, LinearTransition } from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

import { styles } from "./Paragraph.styles";

interface ParagraphProps {
  note: string | null;
  active: boolean;
  children: React.ReactNode;
  status?: StoryRequest["status"];
}

const Paragraph = memo(({ note, active, children, status }: ParagraphProps) => {
  const parsedNote = note === "null" ? null : note;
  const displayedNote = useTypingAnimation(parsedNote, 10, status === "IN_PROGRESS");

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["transparent", `${colors.white}20`],
  });

  return (
    <Animated.View style={[styles.wrapper, { backgroundColor }]}>
      {parsedNote && (
        <Reanimated.View
          style={styles.noteWrapper}
          layout={LinearTransition.duration(300).easing(Easing.out(Easing.quad))}
        >
          <Text style={styles.note}>{displayedNote}</Text>
        </Reanimated.View>
      )}
      <View style={styles.sentenceContainer}>{children}</View>
    </Animated.View>
  );
});

Paragraph.displayName = "Paragraph";

export default Paragraph;
