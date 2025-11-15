import { memo, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./Paragraph.styles";

interface ParagraphProps {
  summary: string | null;
  active: boolean;
  children: React.ReactNode;
}

const Paragraph = memo(({ summary, active, children }: ParagraphProps) => {
  const parsedSummary = summary === "null" ? null : summary;

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
      {parsedSummary && (
        <View style={styles.summaryWrapper}>
          <Text style={styles.summary}>{parsedSummary}</Text>
        </View>
      )}
      <View style={styles.sentenceContainer}>{children}</View>
    </Animated.View>
  );
});

Paragraph.displayName = "Paragraph";

export default Paragraph;
