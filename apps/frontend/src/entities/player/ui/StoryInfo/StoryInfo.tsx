import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BaseStoryFields, Track } from "@lymo/schemas/doc";
import { View, Text, TouchableOpacity } from "react-native";

import Avatar from "@/entities/auth/ui/Avatar";
import GradientFill from "@/shared/components/GradientFill";
import formatRelativeTime from "@/shared/utils/formatRelativeTime";

import useCreateFavoriteMutation from "../../hooks/useCreateFavoriteMutation";
import useFavoriteQuery from "../../hooks/useFavoriteQuery";

import { styles } from "./styles";

interface StoryInfoProps {
  story: { id: string; data: BaseStoryFields };
  track: { id: string; data: Track };
}

export default function StoryInfo({ story, track }: StoryInfoProps) {
  const { data: favorite } = useFavoriteQuery({ storyId: story.id });
  const {
    mutate: createFavorite,
    isPending: isCreateFavoritePedning,
    isSuccess: isCreateFavoriteSuccess,
    reset: resetCreateFavorite,
  } = useCreateFavoriteMutation({
    storyId: story.id,
    trackId: track.id,
  });

  const isStoryByBot = story.data.userId === "bot";

  // 좋아요 버튼 핸들러
  const handlePressFavorite = () => {
    if (isCreateFavoritePedning) return;

    // 이미 좋아요한 경우
    if (favorite) {
      resetCreateFavorite();
      // TODO: 좋아요 취소 뮤테이션 추가
    }

    // 좋아요하지 않은 경우
    else {
      createFavorite();
    }
  };

  const favoriteCount = story.data.stats.favoriteCount + (isCreateFavoriteSuccess ? 1 : 0);

  return (
    <View style={styles.wrapper}>
      <View style={styles.top}>
        {/* 아바타 */}
        {isStoryByBot ? (
          <MaterialIcons name="auto-awesome" size={28} style={styles.botIcon} />
        ) : (
          <Avatar photo={story.data.userAvatar} style={styles.avatar} />
        )}

        {/* 이름 */}
        {isStoryByBot ? (
          <View style={styles.textContainer}>
            <GradientFill
              gradientOptions={{
                colors: ["#a5ffee", "#b152ffff"],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
              }}
            >
              <Text style={styles.botText}>AI가 생성한 해석</Text>
            </GradientFill>
            <Text style={styles.warning}>부정확한 정보가 포함되어 있을 수 있습니다.</Text>
          </View>
        ) : (
          <View style={styles.usernameWrapper}>
            <Text style={styles.username}>{story.data.userName}</Text>
            <Text style={styles.usernameSuffix}>의 해석</Text>
          </View>
        )}
      </View>

      <View style={styles.statContainer}>
        {/* 업데이트 날짜 */}
        <View style={styles.stat}>
          <MaterialIcons name="update" size={20} style={styles.statIcon} />
          <Text style={styles.statText}>{`${formatRelativeTime(story.data.updatedAt)} 전`}</Text>
        </View>

        {/* 조회수 */}
        <View style={styles.stat}>
          <MaterialIcons name="visibility" size={20} style={styles.statIcon} />
          <Text style={styles.statText}>{`${story.data.stats.viewCount.toLocaleString()}회`}</Text>
        </View>

        {/* 좋아요 수 */}
        <TouchableOpacity style={[styles.stat, styles.pressable]} onPress={handlePressFavorite}>
          <MaterialIcons
            name={favorite ? "favorite" : "favorite-border"}
            size={20}
            style={favorite ? styles.filledFavoriteIcon : styles.statIcon}
          />
          <Text style={styles.statText}>{`${favoriteCount.toLocaleString()}개`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
