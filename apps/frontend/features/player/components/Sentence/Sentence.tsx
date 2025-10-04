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
      <Text style={[styles.sentence, active && activeTextStyle]}>
        {sentence}
      </Text>
      <Text style={[styles.translation, active && activeTranslationStyle]}>
        {translation}
      </Text>
    </View>
  );
}

const activeTextStyle = {
  color: colors.onBackground,
  fontSize: 22,
};

const activeTranslationStyle = {
  color: colors.onBackground,
};
