import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

  const handlePlayTrack = (track: { id: string; title: string; coverUrl: string }) => {
    setTrackSource({
      from: "manual",
      track: track,
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
          numColumns={Math.ceil(popularTracks.length / 4)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={popularTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item: track }) => (
            <Link href={`/player`} key={track.id} asChild>
              <NormalTrack
                title={track.title}
                artist={track.artist}
                coverUrl={track.coverUrl}
                onPress={() =>
                  handlePlayTrack({ id: track.id, title: track.title, coverUrl: track.coverUrl })
                }
              />
            </Link>
          )}
        />
      </ScrollView>
    </View>
  );
}
