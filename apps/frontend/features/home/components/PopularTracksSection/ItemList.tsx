import { Link } from "expo-router";
import { FlatList, ScrollView } from "react-native";

import useHandlePlayTrack from "@/entities/home/hooks/useHandlePlayTrack";
import usePopularTracksQuery from "@/entities/home/hooks/usePopularTracksQuery";
import NormalTrack from "@/entities/home/ui/NormalTrack";

import { styles } from "./styles";

export default function ItemList() {
  const { data: popularTracks } = usePopularTracksQuery();
  const handlePlayTrack = useHandlePlayTrack();

  return (
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
  );
}
