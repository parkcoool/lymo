import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, Text } from "react-native";

import useCreateFavoriteMutation from "../../hooks/useCreateFavoriteMutation";
import useDeleteFavoriteMutation from "../../hooks/useDeleteFavoriteMutation";
import useFavoriteQuery from "../../hooks/useFavoriteQuery";
import { useFavoriteStore } from "../../models/favoriteStore";

import { styles } from "./styles";

interface FavoriteProps {
  storyId: string;
  trackId?: string;
  favoriteCount: number;
}

export default function Favorite({ storyId, trackId, favoriteCount }: FavoriteProps) {
  const { data: favorite } = useFavoriteQuery({ storyId });
  const { favoriteDeltaMap } = useFavoriteStore();

  const { mutate: createFavorite, isPending: isCreateFavoritePending } = useCreateFavoriteMutation({
    storyId,
  });
  const { mutate: deleteFavorite, isPending: isDeleteFavoritePending } = useDeleteFavoriteMutation({
    storyId,
  });

  const isDisabled = isCreateFavoritePending || isDeleteFavoritePending || !trackId;

  // 좋아요 버튼 핸들러
  const handlePressFavorite = () => {
    if (isDisabled) return;

    if (favorite) deleteFavorite(trackId);
    else createFavorite(trackId);
  };

  const adjustedFavoriteCount = favoriteCount + (favoriteDeltaMap.get(storyId) ?? 0);

  return (
    <TouchableOpacity
      style={styles.statContent}
      onPress={handlePressFavorite}
      disabled={isDisabled}
    >
      <MaterialIcons
        name={favorite ? "favorite" : "favorite-border"}
        size={20}
        style={favorite ? styles.filledFavoriteIcon : styles.statIcon}
      />
      <Text style={styles.statText}>{`${adjustedFavoriteCount.toLocaleString()}개`}</Text>
    </TouchableOpacity>
  );
}
