import { View, Text } from "react-native";
import { styles } from "./Paragraph.styles";
import { colors } from "@/constants/colors";

interface ParagraphProps {
  summary: string | null;
  active: boolean;
  children: React.ReactNode;
}

export default function Paragraph({
  summary,
  active,
  children,
}: ParagraphProps) {
  return (
    <View style={[styles.wrapper, active && activeStyle]}>
      {summary && (
        <View style={styles.summaryWrapper}>
          <Text style={styles.summary}>{summary}</Text>
        </View>
      )}
      <View style={styles.sentenceContainer}>{children}</View>
    </View>
  );
}

const activeStyle = {
  backgroundColor: `${colors.surface}B3`,
};
