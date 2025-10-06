import { Link } from "expo-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { View, Text, FlatList } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Track } from "@lymo/schemas/shared";

import getPopularTracks from "@/features/track/apis/getPopularTracks";
import { CompactTrack } from "@/features/track/components/Track";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { useSyncStore } from "@/contexts/useSyncStore";

import { styles } from "./PopularTracksSection.styles";

export default function PopularTracksSection() {
  const { data: popularTracks } = useSuspenseQuery({
    queryKey: ["popular-tracks"],
    queryFn: async () => getPopularTracks(),
  });

  const { setTrackSource } = useTrackSourceStore();
  const { setIsSynced } = useSyncStore();

  const handlePlayTrack = (track: Track) => {
    setTrackSource({
      from: "manual",
      track: {
        id: track.id,
        title: track.title,
        coverUrl: track.coverUrl,
      },
    });
    setIsSynced(false);
  };

  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons
          name="trending-up"
          size={24}
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>인기</Text>
      </View>

      {/* 곡 목록 */}
      <FlatList
        contentContainerStyle={styles.sectionContent}
        horizontal
        data={popularTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item: track }) => (
          <Link href={`/player`} key={track.id} asChild>
            <CompactTrack
              title={track.title}
              coverUrl={track.coverUrl}
              onPress={() => handlePlayTrack(track)}
            />
          </Link>
        )}
      />
    </View>
  );
}
