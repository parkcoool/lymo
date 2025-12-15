import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity, Text } from "react-native";

import useCreateFavoriteMutation from "../../hooks/useCreateFavoriteMutation";
import useDeleteFavoriteMutation from "../../hooks/useDeleteFavoriteMutation";
import useFavoriteQuery from "../../hooks/useFavoriteQuery";

import { styles } from "./styles";

interface FavoriteProps {
  storyId: string;
  trackId: string;
  favoriteCount: number;
}

export default function Favorite({ storyId, trackId, favoriteCount }: FavoriteProps) {
  const { data: favorite } = useFavoriteQuery({ storyId });

  const { mutate: createFavorite, isPending: isCreateFavoritePending } = useCreateFavoriteMutation({
    storyId,
    trackId,
  });
  const { mutate: deleteFavorite, isPending: isDeleteFavoritePending } = useDeleteFavoriteMutation({
    storyId,
    trackId,
  });

  const isDisabled = isCreateFavoritePending || isDeleteFavoritePending;

  // 좋아요 버튼 핸들러
  const handlePressFavorite = () => {
    if (isDisabled) return;

    // 이미 좋아요한 경우
    if (favorite) {
      deleteFavorite();
    }

    // 좋아요하지 않은 경우
    else {
      createFavorite();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.stat, styles.pressable]}
      onPress={handlePressFavorite}
      disabled={isDisabled}
    >
      <MaterialIcons
        name={favorite ? "favorite" : "favorite-border"}
        size={20}
        style={favorite ? styles.filledFavoriteIcon : styles.statIcon}
      />
      <Text style={styles.statText}>{`${favoriteCount.toLocaleString()}개`}</Text>
    </TouchableOpacity>
  );
}
