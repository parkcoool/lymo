import React, { Ref } from "react";
import { View, Text } from "react-native";

import Skeleton from "@/components/shared/Skeleton";

import { styles } from "./Sentence.styles";

interface SentenceProps {
  sentence: string;
  translation?: string | null;
  active: boolean;
  ref?: Ref<View>;
}

export default function Sentence({ sentence, translation, active, ref }: SentenceProps) {
  return (
    <View style={styles.container} ref={ref}>
      <Text style={[styles.sentence, active && styles.active]}>{sentence}</Text>

      {/* 번역 스켈레톤 */}
      {translation === undefined && <Skeleton width="70%" height={16} opacity={0.4} />}

      {/* 번역 표시 */}
      {translation && (
        <Text style={[styles.translation, active && styles.active]}>{translation}</Text>
      )}
    </View>
  );
}
