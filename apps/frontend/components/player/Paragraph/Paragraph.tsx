import { View, Text } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./Paragraph.styles";

interface ParagraphProps {
  summary: string | null;
  active: boolean;
  children: React.ReactNode;
}

export default function Paragraph({ summary, active, children }: ParagraphProps) {
  const parsedSummary = summary === "null" ? null : summary;

  return (
    <View style={[styles.wrapper, active && activeStyle]}>
      {parsedSummary && (
        <View style={styles.summaryWrapper}>
          <Text style={styles.summary}>{parsedSummary}</Text>
        </View>
      )}
      <View style={styles.sentenceContainer}>{children}</View>
    </View>
  );
}

const activeStyle = {
  backgroundColor: `${colors.white}20`,
};
