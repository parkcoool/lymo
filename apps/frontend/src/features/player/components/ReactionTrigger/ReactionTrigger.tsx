import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactionEmojiSchema } from "@lymo/schemas/shared";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./styles";

export default function ReactionTrigger() {
  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <>
      <View style={[styles.triggerWrapper, { bottom: bottom + 20 }]}>
        <TouchableOpacity style={styles.button} onPress={handleToggleOpen}>
          <MaterialIcons style={styles.icon} size={20} name="add-reaction" />
        </TouchableOpacity>
      </View>

      {isOpen && (
        <Animated.ScrollView
          style={[styles.emojiContainer, { bottom: bottom + 88 }]}
          contentContainerStyle={styles.emojiContentContainer}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          {ReactionEmojiSchema.options.map((emoji, index) => (
            <Animated.View
              key={emoji}
              entering={ZoomIn.springify().delay(Math.max(0, 4 - index) * 50)}
            >
              <TouchableOpacity style={styles.emojiWrapper}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
    </>
  );
}
