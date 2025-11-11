import React, { Ref } from "react";
import { View, Text } from "react-native";

import { colors } from "@/constants/colors";

import { styles } from "./Sentence.styles";

interface SentenceProps {
  sentence: string;
  translation: string | null;
  active: boolean;
  ref?: Ref<View>;
}

export default function Sentence({
  sentence,
  translation,
  active,
  ref,
}: SentenceProps) {
  return (
    <View style={styles.container} ref={ref}>
      <Text style={[styles.sentence, active && activeStyle]}>{sentence}</Text>
      {translation && (
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
