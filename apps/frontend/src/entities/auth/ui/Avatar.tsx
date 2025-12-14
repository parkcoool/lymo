import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Image, LayoutChangeEvent, View, ViewProps } from "react-native";

import { styles } from "./styles";

interface AvatarProps extends ViewProps {
  photo?: string | null;
}

export default function Avatar({ photo, style, ...props }: AvatarProps) {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width: layoutWidth } = event.nativeEvent.layout;
    setWidth(layoutWidth);
  };

  return (
    <View style={[styles.wrapper, style]} onLayout={handleLayout} {...props}>
      {photo ? (
        <Image source={{ uri: photo }} />
      ) : (
        <MaterialIcons name="person" size={Math.max(width * 0.8, 12)} style={styles.icon} />
      )}
    </View>
  );
}
