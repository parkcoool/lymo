import { Lyrics as LyricsType, LyricsSentence } from "@lymo/schemas/shared";
import { View } from "react-native";

import Paragraph from "@/components/player/Paragraph";
import Sentence from "@/components/player/Sentence";
import { useSyncStore } from "@/contexts/useSyncStore";
import useDeviceMediaTimestamp from "@/hooks/useDeviceMediaTimestamp";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: LyricsType;
}

export default function Lyrics({ lyrics }: LyricsProps) {
  const timestamp = useDeviceMediaTimestamp();
  const { isSynced } = useSyncStore();

  return (
    <View style={styles.container}>
      {lyrics.map((paragraph, paragraphIndex) => (
        <Paragraph
          key={paragraphIndex}
          summary={paragraph.summary}
          active={
            isSynced ? isActiveParagraph(paragraph.sentences, timestamp) : false
          }
        >
          {paragraph.sentences.map((sentence, sentenceIndex) => (
            <Sentence
              key={sentenceIndex}
              sentence={sentence.text}
              translation={sentence.translation}
              active={isSynced ? isActiveSentence(sentence, timestamp) : false}
            />
          ))}
        </Paragraph>
      ))}
    </View>
  );
}

const isActiveParagraph = (paragraph: LyricsSentence[], timestamp: number) =>
  paragraph[0].start <= timestamp &&
  timestamp < paragraph[paragraph.length - 1].end;

const isActiveSentence = (sentence: LyricsSentence, timestamp: number) =>
  sentence.start <= timestamp && timestamp < sentence.end;
