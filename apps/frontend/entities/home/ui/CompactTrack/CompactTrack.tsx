import { LinearGradient } from "expo-linear-gradient";
import { Image, Text, TouchableOpacity } from "react-native";

import { styles } from "./styles";

interface CompactTrackProps {
  albumArt: string;
  title: string;
  onPress?: () => void;
}

export default function CompactTrack({ albumArt, title, onPress }: CompactTrackProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image source={{ uri: albumArt }} style={styles.albumArt} />
      <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.8)"]} style={styles.overlay}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
