import { LyricsProvider } from "@lymo/schemas/shared";
import { Ref } from "react";
import { Text, View } from "react-native";

import useActiveSentence from "@/entities/deviceMedia/hooks/useActiveSentence";
import type { Section } from "@/entities/player/models/types";
import Paragraph from "@/entities/player/ui/Paragraph";
import Sentence from "@/entities/player/ui/Sentence";
import getLyricsProviderName from "@/entities/story/utils/getLyricsProviderName";
import { useSyncStore } from "@/shared/models/syncStore";

import { styles } from "./styles";

interface LyricsProps {
  lyrics: Section[];
  lyricsProvider?: LyricsProvider;
  activeSentenceRef: Ref<View>;
  isCompleted?: boolean;
}

export default function Lyrics({
  lyrics,
  lyricsProvider,
  activeSentenceRef,
  isCompleted = true,
}: LyricsProps) {
  const { isSynced } = useSyncStore();

  const [activeSectionIndex, activeSentenceIndex] = useActiveSentence({
    lyrics,
    enabled: isSynced,
  });

  // 가사 제공자 이름
  const lyricsProviderName = lyricsProvider ? getLyricsProviderName(lyricsProvider) : null;

  return (
    <View style={styles.container}>
      <View style={styles.lyrics}>
        {lyrics.map((section, sectionIndex) => (
          <Paragraph
            key={sectionIndex}
            note={section.note}
            active={activeSectionIndex === sectionIndex}
            isCompleted={isCompleted}
          >
            {section.lyrics.map((lyric, lyricIndex) => {
              const isActive =
                activeSectionIndex === sectionIndex && activeSentenceIndex === lyricIndex;
              const sentenceKey = `${sectionIndex}-${lyricIndex}`;

              return (
                <Sentence
                  key={sentenceKey}
                  sentence={lyric.text}
                  translation={lyric.translation}
                  active={isActive}
                  ref={isActive ? activeSentenceRef : undefined}
                  isCompleted={isCompleted}
                />
              );
            })}
          </Paragraph>
        ))}
      </View>

      {lyricsProviderName && (
        <View style={styles.lyricsProviderWrapper}>
          <Text style={styles.lyricsProviderText}>{`가사 제공: ${lyricsProviderName}`}</Text>
        </View>
      )}
    </View>
  );
}
