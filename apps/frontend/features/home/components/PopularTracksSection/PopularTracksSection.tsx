import { useSuspenseQuery } from "@tanstack/react-query";
import { View, ScrollView, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import getPopularTracks from "@/features/track/apis/getPopularTracks";

import { styles } from "./PopularTracksSection.styles";
import { CompactTrack } from "@/features/track/components/Track";

export default function PopularTracksSection() {
  const { data: popularTracks } = useSuspenseQuery({
    queryKey: ["popular-tracks"],
    queryFn: async () => getPopularTracks(),
  });

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
          <CompactTrack
            key={track.id}
            title={track.title}
            coverUrl={track.coverUrl}
          />
        ))}
      </ScrollView>
    </View>
  );
}
