import { Link } from "expo-router";
import { FlatList } from "react-native";

import useHandlePlayTrack from "@/entities/home/hooks/useHandlePlayTrack";
import useNewTracksQuery from "@/entities/home/hooks/useNewTracksQuery";
import CompactTrack from "@/entities/home/ui/CompactTrack";

import { styles } from "./styles";

export default function ItemList() {
  const { data: newTracks } = useNewTracksQuery();
  const handlePlayTrack = useHandlePlayTrack();

  return (
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
  );
}
