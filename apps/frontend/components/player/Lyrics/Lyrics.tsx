import { StoryRequest } from "@lymo/schemas/doc";
import { Lyric, LyricsProvider } from "@lymo/schemas/shared";
import { Ref, useMemo } from "react";
import { Text, View } from "react-native";

import Paragraph from "@/components/player/Paragraph";
import Sentence from "@/components/player/Sentence";
import { useSettingStore } from "@/contexts/useSettingStore";
import { useSyncStore } from "@/contexts/useSyncStore";
import useDeviceMediaTimestamp from "@/hooks/useDeviceMediaTimestamp";
import useTrackKey from "@/hooks/useTrackKey";
import { Section } from "@/types/track";
import getLyricsProviderName from "@/utils/getLyricsProviderName";

import { styles } from "./Lyrics.styles";

interface LyricsProps {
  lyrics: Section[];
  lyricsProvider?: LyricsProvider;
  activeSentenceRef: Ref<View>;
  status?: StoryRequest["status"];
}

export default function Lyrics({ lyrics, lyricsProvider, activeSentenceRef, status }: LyricsProps) {
  const { setting } = useSettingStore();
  const trackKey = useTrackKey();
  const timestamp = useDeviceMediaTimestamp();
  const { isSynced } = useSyncStore();

  // 설정에 의해 조정된 타임스탬프
  const delay = useMemo(
    () => (trackKey ? setting.delayMap.get(trackKey) ?? 0 : 0) / 1000,
    [setting.delayMap, trackKey]
  );
  const adjustedTimestamp = timestamp + delay;

  // 가사 제공자 이름
  const lyricsProviderName = lyricsProvider ? getLyricsProviderName(lyricsProvider) : null;

  return (
    <View style={styles.container}>
      <View style={styles.lyrics}>
        {lyrics.map((section, sectionIndex) => (
          <Paragraph
            key={sectionIndex}
            note={section.note}
            active={isSynced && isActiveParagraph(section, adjustedTimestamp)}
            status={status}
          >
            {section.lyrics.map((lyric, lyricIndex) => {
              const isActive = isSynced && isActiveSentence(lyric, adjustedTimestamp);
              const sentenceKey = `${sectionIndex}-${lyricIndex}`;

              return (
                <Sentence
                  key={sentenceKey}
                  sentence={lyric.text}
                  translation={lyric.translation}
                  active={isActive}
                  ref={isActive ? activeSentenceRef : undefined}
                  status={status}
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

const isActiveParagraph = (section: Section, timestamp: number) =>
  section.lyrics.length > 0 &&
  section.lyrics[0].start <= timestamp &&
  timestamp < section.lyrics[section.lyrics.length - 1].end;

const isActiveSentence = (lyric: Lyric, timestamp: number) =>
  lyric.start <= timestamp && timestamp < lyric.end;
