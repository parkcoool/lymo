import { WordNote } from "@lymo/schemas/shared";
import { Text } from "react-native";

import getHighlightColor from "../../utils/getHighlightColor";

import { styles } from "./styles";

interface ContentProps {
  sentence: string;
  wordNote?: WordNote;
}

export default function Content({ sentence, wordNote }: ContentProps) {
  if (
    !wordNote?.word ||
    !sentence.toLowerCase().includes(wordNote.word.toLowerCase())
  ) {
    return sentence;
  }

  const word = wordNote.word;
  const index = sentence.toLowerCase().indexOf(word.toLowerCase());
  const before = sentence.substring(0, index);
  const after = sentence.substring(index + word.length);

  return (
    <>
      <Text>{before}</Text>
      <Text
        style={[
          styles.highlight,
          {
            backgroundColor: `${getHighlightColor(wordNote.lyricIndex)}33`,
          },
        ]}
      >
        {word}
      </Text>
      <Text>{after}</Text>
    </>
  );
}
