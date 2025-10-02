import { useSuspenseQuery } from "@tanstack/react-query";
import { View, ScrollView, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import getPopularTracks from "@/features/track/apis/getPopularTracks";
import { CompactTrack } from "@/features/track/components/Track";
import type { TrackDocumentWithId } from "@/types/track";

import { styles } from "./PopularTracksSection.styles";
import { useActiveTrackStore } from "@/contexts/useActiveTrackStore";
import { Link } from "expo-router";

export default function PopularTracksSection() {
  const { data: popularTracks } = useSuspenseQuery({
    queryKey: ["popular-tracks"],
    queryFn: async () => getPopularTracks(),
  });

  const { setTrack, setIsSynced } = useActiveTrackStore();

  const handlePlayTrack = (track: TrackDocumentWithId) => {
    setTrack(track);
    setIsSynced(false);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons
          name="trending-up"
          size={24}
          style={styles.sectionIcon}
        />
        <Text style={styles.sectionTitle}>인기</Text>
      </View>
      <ScrollView contentContainerStyle={styles.sectionContent} horizontal>
        {popularTracks.map((track) => (
          <Link href="/player" key={track.id} asChild>
            <CompactTrack
              title={track.title}
              coverUrl={track.coverUrl}
              onPress={() => handlePlayTrack(track)}
            />
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}
