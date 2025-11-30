import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Track } from "@lymo/schemas/doc";
import { Link } from "expo-router";
import { View, Text, FlatList, ScrollView } from "react-native";

import { NormalTrack } from "@/components/home/Track";
import { useSyncStore } from "@/contexts/useSyncStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import usePopularTracksQuery from "@/hooks/queries/usePopularTracksQuery";

import { styles } from "./PopularTracksSection.styles";

export default function PopularTracksSection() {
  const { data: popularTracks } = usePopularTracksQuery();

  const { setTrackSource } = useTrackSourceStore();
  const { setIsSynced } = useSyncStore();

  const handlePlayTrack = (trackId: string, track: Track) => {
    setTrackSource({
      from: "manual",
      track: { ...track, id: trackId },
    });
    setIsSynced(false);
  };

  return (
    <View style={styles.section}>
      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <MaterialIcons name="trending-up" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>인기</Text>
      </View>

      {/* 곡 목록 */}
      <ScrollView horizontal directionalLockEnabled={true} alwaysBounceVertical={false}>
        <FlatList
          style={styles.sectionContent}
          contentContainerStyle={styles.sectionContentContainer}
          columnWrapperStyle={styles.sectionContentWrapper}
          key={popularTracks.length}
          numColumns={Math.max(Math.ceil(popularTracks.length / 4), 2)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={popularTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item: track }) => (
            <Link href={`/player`} key={track.id} asChild>
              <NormalTrack
                title={track.title}
                artists={track.artists}
                albumArt={track.albumArt}
                onPress={() => handlePlayTrack(track.id, track)}
              />
            </Link>
          )}
        />
      </ScrollView>
    </View>
  );
}
