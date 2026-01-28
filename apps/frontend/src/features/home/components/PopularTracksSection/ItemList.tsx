import { Link } from "expo-router";
import { FlatList, ScrollView } from "react-native";

import useHandlePlayTrack from "@/entities/home/hooks/useHandlePlayTrack";
import usePopularTracksQuery from "@/entities/home/hooks/usePopularTracksQuery";
import NormalTrack from "@/entities/home/ui/NormalTrack";

import { styles } from "./styles";

export default function ItemList() {
  const { data: popularTracks } = usePopularTracksQuery();
  const handlePlayTrack = useHandlePlayTrack();

  // 4개 행으로 열 우선 정렬
  const numRows = 4;
  const numCols = Math.max(Math.ceil(popularTracks.length / numRows), 2);
  const reorderedTracks = [];

  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < numRows; row++) {
      const index = row * numCols + col;
      if (index < popularTracks.length) {
        reorderedTracks.push(popularTracks[index]);
      }
    }
  }

  return (
    <ScrollView horizontal directionalLockEnabled={true} alwaysBounceVertical={false}>
      <FlatList
        style={styles.sectionContent}
        contentContainerStyle={styles.sectionContentContainer}
        columnWrapperStyle={styles.sectionContentWrapper}
        key={popularTracks.length}
        numColumns={numCols}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={reorderedTracks}
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
