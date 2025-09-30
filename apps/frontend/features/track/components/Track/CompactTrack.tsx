import { styles } from "./CompactTrack.styles";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CompactTrackProps {
  coverUrl?: string;
  title: string;
}

export default function CompactTrack({ coverUrl, title }: CompactTrackProps) {
  return (
    <TouchableOpacity style={styles.wrapper}>
      <Image source={{ uri: coverUrl }} style={styles.cover} />
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.8)"]}
        style={styles.overlay}
      >
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
