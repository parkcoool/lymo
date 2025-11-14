import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { View, Text, FlatList } from "react-native";

import { CompactTrack } from "@/components/home/Track";
import { useSyncStore } from "@/contexts/useSyncStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import useNewTracksQuery from "@/hooks/queries/useNewTracksQuery";

import { styles } from "./NewTracksSection.styles";

export default function NewTracksSection() {
  const { data: newTracks } = useNewTracksQuery();

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
        <MaterialIcons name="new-releases" size={24} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>신규 등록</Text>
      </View>

      {/* 곡 목록 */}
      <FlatList
        contentContainerStyle={styles.sectionContent}
        horizontal
        data={newTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item: track }) => (
          <Link href={`/player`} key={track.id} asChild>
            <CompactTrack
              title={track.title}
              coverUrl={track.coverUrl}
              onPress={() =>
                handlePlayTrack({ id: track.id, title: track.title, coverUrl: track.coverUrl })
              }
            />
          </Link>
        )}
      />
    </View>
  );
}
