import { useQuery } from "@tanstack/react-query";
import { ScrollView, View } from "react-native";
import type { Track, TrackDetail } from "@lymo/schemas/shared";

import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import {
  Summary,
  IncompleteSummary,
} from "@/features/player/components/Summary";
import getTrack from "@/features/track/apis/getTrack";
import Paragraph from "@/features/player/components/Paragraph";
import Sentence from "@/features/player/components/Sentence";
import useAddTrackFromDeviceMediaEffect from "@/features/track/hooks/useAddTrackFromDeviceMediaEffect";

export default function Player() {
  const { track: activeTrack } = useActiveTrackStore();
  useAddTrackFromDeviceMediaEffect({});

  const { data: completeTrack } = useQuery<Track & TrackDetail>({
    queryKey: ["track", activeTrack?.id],
    enabled: activeTrack?.id !== undefined,
    queryFn: () => getTrack({ trackId: activeTrack!.id! }),
  });

  return (
    <ScrollView
      style={{
        flexDirection: "column",
        flex: 1,
      }}
    >
      {/* 곡 메타데이터 및 요약 */}
      {completeTrack ? (
        <Summary
          coverUrl={completeTrack.coverUrl}
          title={completeTrack.title}
          artist={completeTrack.artist}
          album={completeTrack.album}
          publishedAt={completeTrack.publishedAt}
          summary={completeTrack.summary}
        />
      ) : (
        <IncompleteSummary
          coverUrl={activeTrack?.coverUrl}
          title={activeTrack?.title}
          artist={activeTrack?.artist}
          album={activeTrack?.album}
          publishedAt={activeTrack?.publishedAt}
          summary={activeTrack?.summary}
        />
      )}

      {/* 가사 */}
      <View>
        {completeTrack &&
          completeTrack.lyrics.map((paragraph, paragraphIndex) => (
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
