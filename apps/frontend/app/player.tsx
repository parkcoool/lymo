import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";

import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import Summary from "@/features/player/components/Summary";
import getTrack from "@/features/track/apis/getTrack";
import { DetailedTrackDocumentWithId } from "@/types/track";
import Paragraph from "@/features/player/components/Paragraph";
import Sentence from "@/features/player/components/Sentence";

export default function Player() {
  const { track: activeTrack } = useActiveTrackStore();

  const { data: track } = useQuery<Partial<DetailedTrackDocumentWithId> | null>(
    {
      queryKey: ["track", activeTrack?.id],
      enabled: activeTrack?.id !== undefined,
      placeholderData: activeTrack,
      queryFn: () => getTrack({ trackId: activeTrack!.id! }),
    }
  );

  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* 곡 메타데이터 및 요약 */}
      <Summary
        coverUrl={track?.coverUrl}
        title={track?.title}
        artist={track?.artist}
        album={track?.album}
        publishedAt={track?.publishedAt}
        summary={track?.summary}
      />

      {/* 가사 */}
      <View>
        {track?.lyrics !== undefined &&
          track.lyrics.map((paragraph, paragraphIndex) => (
            <Paragraph
              key={paragraphIndex}
              summary={paragraph.summary}
              active={false}
            >
              {paragraph.sentences.map((sentence, sentenceIndex) => (
                <Sentence
                  key={sentenceIndex}
                  sentence={sentence.text}
                  translation={sentence.translation}
                  active={false}
                />
              ))}
            </Paragraph>
          ))}
      </View>
    </ScrollView>
  );
}
