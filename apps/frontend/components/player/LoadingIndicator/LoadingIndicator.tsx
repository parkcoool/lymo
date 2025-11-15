import { Stack } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { SummarySkeleton } from "@/components/player/Summary";
import Header from "@/components/shared/Header/Header";
import Skeleton from "@/components/shared/Skeleton";
import useCoverColorQuery from "@/hooks/queries/useCoverColorQuery";
import mixColors from "@/utils/blend";

import { styles } from "./LoadingIndicator.styles";

interface LoadingIndicatorProps {
  title?: string;
  artist?: string;
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
  const headerBackgroundColor = useMemo(
    () => mixColors([coverColor ?? "#000000", "#000000CC"]),
    [coverColor]
  );

  return (
    <>
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
            backgroundColor: "#000000CC",
            paddingBottom: 12,
          }}
        >
          {/* 곡 메타데이터 및 설명 */}
          <SummarySkeleton title={title} artist={artist} album={album} coverUrl={coverUrl} />

          {/* 가사 */}
          <View style={styles.lyricsSkeletonContainer}>
            <View style={styles.lyricsSkeleton}>
              <Skeleton height={24} opacity={0.3} />
              <Skeleton height={20} width="70%" opacity={0.2} />
            </View>
            <View style={styles.lyricsSkeleton}>
              <Skeleton height={24} opacity={0.3} />
              <Skeleton height={20} width="70%" opacity={0.2} />
            </View>
            <View style={styles.lyricsSkeleton}>
              <Skeleton height={24} opacity={0.3} />
              <Skeleton height={20} width="70%" opacity={0.2} />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* 헤더 설정 */}
      <Stack.Screen
        options={{
          header: (props) => <Header {...props} backgroundColor={headerBackgroundColor} />,
        }}
      />
    </>
  );
}
