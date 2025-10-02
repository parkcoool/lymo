import { View, Image, Text } from "react-native";
import { styles } from "./Summary.styles";

interface SummaryProps {
  coverUrl?: string;
  title?: string;
  artist?: string;
  album?: string | null;
  publishedAt?: string | null;
  summary?: string;
}

export default function Summary({
  coverUrl,
  title,
  artist,
  album,
  publishedAt,
  summary,
}: SummaryProps) {
  const year = publishedAt ? new Date(publishedAt).getFullYear() : null;
  const detailString = [artist, album, year].filter(Boolean).join(" • ");

  return (
    <View style={styles.wrapper}>
      {/* 곡 정보 */}
      <View style={styles.track}>
        {/* 커버 이미지 */}
        <Image source={{ uri: coverUrl ?? "" }} style={styles.cover} />

        {/* 메타데이터 */}
        <View style={styles.trackMetadata}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.details} numberOfLines={1}>
            {detailString}
          </Text>
        </View>
      </View>

      {/* 요약 */}
      {summary && summary.length > 0 && (
        <Text style={styles.summary}>{summary}</Text>
      )}
    </View>
  );
}
