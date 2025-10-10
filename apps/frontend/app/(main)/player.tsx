import { ScrollView, View, Text } from "react-native";

import { colors } from "@/constants/colors";
import { useSyncStore } from "@/contexts/useSyncStore";
import useCoverColor from "@/features/track/hooks/useCoverColor";
import Summary from "@/features/player/components/Summary";
import Lyrics from "@/features/player/components/Lyrics";
import useDisplayedTrack from "@/features/player/hooks/useDisplayedTrack";
import ErrorIndicator from "@/features/player/components/ErrorIndicator";
import LoadingIndicator from "@/features/player/components/LoadingIndicator";
import LyricsGeneratingIndicator from "@/features/player/components/LyricsGeneratingIndicator";

export default function Player() {
  const { displayedTrack, isLoading, error, isError } = useDisplayedTrack();
  const { isSynced } = useSyncStore();

  // 커버 색상
  const coverColor = useCoverColor(displayedTrack?.coverUrl ?? null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: coverColor ?? "#000000",
      }}
    >
      <ScrollView
        style={{
          flexDirection: "column",
          flex: 1,
          backgroundColor: "#000000AA",
          paddingBottom: 12,
        }}
      >
        {isError && <ErrorIndicator message={error?.message} />}

        {!isError && (
          <>
            {/* 곡 메타데이터 및 설명 */}
            {displayedTrack && (
              <Summary
                coverUrl={displayedTrack.coverUrl}
                title={displayedTrack.title}
                artist={displayedTrack.artist}
                album={displayedTrack.album}
                publishedAt={displayedTrack.publishedAt}
                summary={displayedTrack.summary}
                coverColor={coverColor}
              />
            )}

            {/* 로딩 */}
            {isLoading && <LoadingIndicator />}

            {/* 가사 */}
            {!isLoading &&
              (displayedTrack?.lyrics && displayedTrack.lyrics.length > 0 ? (
                <Lyrics lyrics={displayedTrack.lyrics} isSynced={isSynced} />
              ) : (
                <LyricsGeneratingIndicator />
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

<View
  style={{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Text style={{ color: colors.onBackground }}>곡을 검색할 수 없습니다.</Text>
</View>;
