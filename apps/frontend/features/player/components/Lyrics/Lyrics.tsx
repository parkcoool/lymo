import { View } from "react-native";
import { Lyrics as LyricsType, LyricsSentence } from "@lymo/schemas/shared";

import Paragraph from "@/features/player/components/Paragraph";
import Sentence from "@/features/player/components/Sentence";
import useTimestamp from "@/features/player/hooks/useTimestamp";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: LyricsType;
  isSynced: boolean;
}

export default function Lyrics({ lyrics, isSynced }: LyricsProps) {
  const timestamp = useTimestamp(isSynced);

  return (
    <View style={styles.container}>
      {lyrics.map((paragraph, paragraphIndex) => (
        <Paragraph
          key={paragraphIndex}
          summary={paragraph.summary}
          active={
            isSynced && timestamp !== undefined
              ? isActiveParagraph(paragraph.sentences, timestamp)
              : false
          }
        >
          {paragraph.sentences.map((sentence, sentenceIndex) => (
            <Sentence
              key={sentenceIndex}
              sentence={sentence.text}
              translation={sentence.translation}
              active={
                isSynced && timestamp !== undefined
                  ? isActiveSentence(sentence, timestamp)
                  : false
              }
            />
          ))}
        </Paragraph>
      ))}
    </View>
  );
}

const isActiveParagraph = (paragraph: LyricsSentence[], timestamp: number) => {
  return paragraph[0].start <= timestamp && timestamp < paragraph.at(-1)!.end;
};

const isActiveSentence = (
  sentence: LyricsSentence,
  timestamp: number | null
) => {
  if (timestamp === null) return false;
  return sentence.start <= timestamp && timestamp < sentence.end;
};
