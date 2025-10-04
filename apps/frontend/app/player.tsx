import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NativeModules, ScrollView, View } from "react-native";
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
import type { MediaModuleType } from "@/types/nativeModules";

const MediaModule = NativeModules.MediaModule as MediaModuleType;

export default function Player() {
  const { track: activeTrack, isSynced } = useActiveTrackStore();
  useAddTrackFromDeviceMediaEffect({});

  const { data: completeTrack } = useQuery<Track & TrackDetail>({
    queryKey: ["track", activeTrack?.id],
    enabled: activeTrack?.id !== undefined,
    queryFn: () => getTrack({ trackId: activeTrack!.id! }),
  });

  const [timestamp, setTimestamp] = useState(0);
  const getTimestamp = async (): Promise<number> => {
    try {
      return Math.floor((await MediaModule.getCurrentPosition()) / 1000);
    } catch (error) {
      return 0;
    }
  };

  // 기기와 연동되어 있으면 재생 위치 갱신
  useEffect(() => {
    if (!isSynced) return;
    const interval = setInterval(async () => {
      const pos = await getTimestamp();
      setTimestamp(pos);
    }, 100);

    return () => clearInterval(interval);
  }, [isSynced]);

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
      <View
        style={{
          paddingHorizontal: 4,
          paddingBottom: 32,
        }}
      >
        {completeTrack &&
          completeTrack.lyrics.map((paragraph, paragraphIndex) => (
            <Paragraph
              key={paragraphIndex}
              summary={paragraph.summary}
              active={
                paragraph.sentences[0].start <= timestamp &&
                timestamp < paragraph.sentences.at(-1)!.end
              }
            >
              {paragraph.sentences.map((sentence, sentenceIndex) => (
                <Sentence
                  key={sentenceIndex}
                  sentence={sentence.text}
                  translation={sentence.translation}
                  active={
                    sentence.start <= timestamp && timestamp < sentence.end
                  }
                />
              ))}
            </Paragraph>
          ))}
      </View>
    </ScrollView>
  );
}
