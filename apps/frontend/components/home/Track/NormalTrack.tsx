import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { styles } from "./NormalTrack.styles";

interface NormalTrackProps {
  coverUrl: string;
  title: string;
  artists: string[];
  onPress?: () => void;
}

export default function NormalTrack({ coverUrl, title, artists, onPress }: NormalTrackProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image source={{ uri: coverUrl }} style={styles.cover} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artists.join(", ")}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} style={styles.playIcon} />
    </TouchableOpacity>
  );
}
