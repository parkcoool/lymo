import { LyricsProvider } from "@lymo/schemas/shared";
import { Ref } from "react";
import { Text, View } from "react-native";

import Paragraph from "@/components/player/Paragraph";
import Sentence from "@/components/player/Sentence";
import { useSettingStore } from "@/contexts/useSettingStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import useDeviceMediaTimestamp from "@/hooks/useDeviceMediaTimestamp";
import useTrackKey from "@/hooks/useTrackKey";
import getLyricsProviderName from "@/utils/getLyricsProviderName";
import { PostLyricsResult } from "@/utils/processLyrics";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: PostLyricsResult;
  lyricsProvider?: LyricsProvider;
  activeSentenceRef: Ref<View>;
}

export default function Lyrics({ lyrics, lyricsProvider, activeSentenceRef }: LyricsProps) {
  const { setting } = useSettingStore();
  const trackKey = useTrackKey();
  const timestamp = useDeviceMediaTimestamp();
  const { isSynced } = useSyncStore();

  // 설정에 의해 조정된 타임스탬프
  const adjustedTimestamp = timestamp + (trackKey ? setting.delayMap.get(trackKey) ?? 0 : 0) / 1000;

  // 가사 제공자 이름
  const lyricsProviderName = lyricsProvider ? getLyricsProviderName(lyricsProvider) : null;

  return (
    <View style={styles.container}>
      <View style={styles.lyrics}>
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

        {lyricsProviderName && (
          <View style={styles.lyricsProviderWrapper}>
            <Text style={styles.lyricsProviderText}>{`가사 제공: ${lyricsProviderName}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const isActiveParagraph = (paragraph: PostLyricsResult[number]["sentences"], timestamp: number) =>
  paragraph.length > 0 &&
  paragraph[0].start <= timestamp &&
  timestamp < paragraph[paragraph.length - 1].end;

const isActiveSentence = (
  sentence: PostLyricsResult[number]["sentences"][number],
  timestamp: number
) => sentence.start <= timestamp && timestamp < sentence.end;
