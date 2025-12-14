import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, TouchableOpacity } from "react-native";

import { styles } from "./styles";

interface AvatarProps extends React.ComponentProps<typeof TouchableOpacity> {
  photo?: string;
}

export default function Avatar({ photo, ...props }: AvatarProps) {
  return (
    <TouchableOpacity style={styles.wrapper} {...props}>
      {photo ? (
        <Image source={{ uri: photo }} />
      ) : (
        <MaterialIcons name="person" size={24} style={styles.icon} />
      )}
    </TouchableOpacity>
  );
}
