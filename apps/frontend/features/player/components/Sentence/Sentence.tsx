import { View, Text } from "react-native";
import { styles } from "./Sentence.styles";
import { colors } from "@/constants/colors";

interface SentenceProps {
  sentence: string;
  translation: string;
  active: boolean;
}

export default function Sentence({
  sentence,
  translation,
  active,
}: SentenceProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.sentence, active && activeStyle]}>{sentence}</Text>
      {translation !== "null" && (
        <Text style={[styles.translation, active && activeStyle]}>
          {translation}
        </Text>
      )}
    </View>
  );
}

const activeStyle = {
  color: colors.onBackground,
  fontWeight: "700" as const,
};
