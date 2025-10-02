import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native";

import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import Summary from "@/features/player/components/Summary";
import getTrack from "@/features/track/apis/getTrack";
import { DetailedTrackDocumentWithId } from "@/types/track";

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
    </ScrollView>
  );
}
