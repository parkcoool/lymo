import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Track } from "@lymo/schemas/doc";
import { Link } from "expo-router";
import { View, Text, FlatList } from "react-native";

import { useSyncStore } from "@/contexts/useSyncStore";
import { useTrackSourceStore } from "@/contexts/useTrackSourceStore";
import { CompactTrack } from "@/features/home/components/Track";
import useNewTracksQuery from "@/features/home/hooks/useNewTracksQuery";

import { styles } from "./NewTracksSection.styles";

export default function NewTracksSection() {
  const { data: newTracks } = useNewTracksQuery();

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
              albumArt={track.albumArt}
              onPress={() => handlePlayTrack(track.id, track)}
            />
          </Link>
        )}
      />
    </View>
  );
}
