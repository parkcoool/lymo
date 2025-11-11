import { Lyrics as LyricsType, LyricsSentence } from "@lymo/schemas/shared";
import { Ref } from "react";
import { View } from "react-native";

import Paragraph from "@/components/player/Paragraph";
import Sentence from "@/components/player/Sentence";
import { useSyncStore } from "@/contexts/useSyncStore";
import useDeviceMediaTimestamp from "@/hooks/useDeviceMediaTimestamp";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: LyricsType;
  activeSentenceRef: Ref<View>;
}

export default function Lyrics({ lyrics, activeSentenceRef }: LyricsProps) {
  const timestamp = useDeviceMediaTimestamp();
  const { isSynced } = useSyncStore();

  return (
    <View style={styles.container}>
      {lyrics.map((paragraph, paragraphIndex) => (
        <Paragraph
          key={paragraphIndex}
          summary={paragraph.summary}
          active={isSynced && isActiveParagraph(paragraph.sentences, timestamp)}
        >
          {paragraph.sentences.map((sentence, sentenceIndex) => {
            const isActive = isSynced && isActiveSentence(sentence, timestamp);
            const sentenceKey = `${paragraphIndex}-${sentenceIndex}`;

            return (
              <Sentence
                key={sentenceKey}
                sentence={sentence.text}
                translation={sentence.translation}
                active={isActive}
                ref={isActive ? activeSentenceRef : undefined}
              />
            );
          })}
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
