import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

interface NormalTrackProps {
  albumArt: string;
  title: string;
  artists: string[];
  onPress?: () => void;
}

export default function NormalTrack({ albumArt, title, artists, onPress }: NormalTrackProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Image source={{ uri: albumArt }} style={styles.albumArt} />
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
