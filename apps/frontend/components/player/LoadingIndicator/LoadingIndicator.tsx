import { ScrollView, View } from "react-native";

import { SummarySkeleton } from "@/components/player/Summary";
import Skeleton from "@/components/shared/Skeleton";
import useCoverColorQuery from "@/hooks/useCoverColorQuery";

import { styles } from "./LoadingIndicator.styles";

interface LoadingIndicatorProps {
  title?: string;
  artist?: string[];
  album?: string | null;
  coverUrl?: string;
}

export default function LoadingIndicator({
  title,
  artist,
  album,
  coverUrl,
}: LoadingIndicatorProps) {
  const { data: coverColor } = useCoverColorQuery(coverUrl);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: coverColor,
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
        {/* 곡 메타데이터 및 설명 */}
        <SummarySkeleton title={title} artist={artist} album={album} coverUrl={coverUrl} />

        {/* 가사 */}
        <View style={styles.lyricsSkeletonContainer}>
          <View style={styles.lyricsSkeleton}>
            <Skeleton height={25} opacity={0.3} />
            <Skeleton height={20} width="70%" opacity={0.2} />
          </View>
          <View style={styles.lyricsSkeleton}>
            <Skeleton height={25} opacity={0.3} />
            <Skeleton height={20} width="70%" opacity={0.2} />
          </View>
          <View style={styles.lyricsSkeleton}>
            <Skeleton height={25} opacity={0.3} />
            <Skeleton height={20} width="70%" opacity={0.2} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
