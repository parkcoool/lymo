import { Lyrics as LyricsType, LyricsSentence } from "@lymo/schemas/shared";
import { Ref } from "react";
import { View } from "react-native";

import Paragraph from "@/components/player/Paragraph";
import Sentence from "@/components/player/Sentence";
import { useSettingStore } from "@/contexts/useSettingStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import useDeviceMediaTimestamp from "@/hooks/useDeviceMediaTimestamp";
import useTrackKey from "@/hooks/useTrackKey";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: LyricsType;
  activeSentenceRef: Ref<View>;
}

export default function Lyrics({ lyrics, activeSentenceRef }: LyricsProps) {
  const { setting } = useSettingStore();
  const trackKey = useTrackKey();
  const timestamp = useDeviceMediaTimestamp();
  const { isSynced } = useSyncStore();

  // 설정에 의해 조정된 타임스탬프
  const adjustedTimestamp = timestamp + (trackKey ? setting.delayMap.get(trackKey) ?? 0 : 0) / 1000;

  return (
    <View style={styles.container}>
      {lyrics.map((paragraph, paragraphIndex) => (
        <Paragraph
          key={paragraphIndex}
          summary={paragraph.summary}
          active={isSynced && isActiveParagraph(paragraph.sentences, adjustedTimestamp)}
        >
          {paragraph.sentences.map((sentence, sentenceIndex) => {
            const isActive = isSynced && isActiveSentence(sentence, adjustedTimestamp);
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
  paragraph[0].start <= timestamp && timestamp < paragraph[paragraph.length - 1].end;

const isActiveSentence = (sentence: LyricsSentence, timestamp: number) =>
  sentence.start <= timestamp && timestamp < sentence.end;
