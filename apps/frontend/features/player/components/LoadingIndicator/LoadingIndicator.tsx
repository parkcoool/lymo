import { Stack } from "expo-router";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { SummarySkeleton } from "@/features/player/components/Summary";
import useCoverColorQuery from "@/features/player/hooks/useCoverColorQuery";
import Header from "@/features/shared/components/Header/Header";
import Skeleton from "@/features/shared/components/Skeleton";
import mixColors from "@/utils/mixColors";

import { styles } from "./LoadingIndicator.styles";

interface LoadingIndicatorProps {
  title?: string;
  artist?: string;
  album?: string | null;
  albumArt?: string;
}

export default function LoadingIndicator({
  title,
  artist,
  album,
  albumArt,
}: LoadingIndicatorProps) {
  const { data: coverColor } = useCoverColorQuery(albumArt);
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
          <SummarySkeleton title={title} artist={artist} album={album} albumArt={albumArt} />

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
