import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactionEmojiSchema } from "@lymo/schemas/shared";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaModule } from "@/core/mediaModule";
import createEmojiReaction from "@/entities/reaction/apis/createEmojiReaction";

import { styles } from "./styles";

interface ReactionTriggerProps {
  storyId?: string;
}

export default function ReactionTrigger({ storyId }: ReactionTriggerProps) {
  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen((prev) => !prev);

  const handleEmojiPress = async (emoji: string) => {
    if (!storyId) return;

    const timestampInSeconds = (await MediaModule.getCurrentPosition()) / 1000;

    await createEmojiReaction({
      storyId,
      timestampInSeconds,
      emoji,
    });
  };

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
              <TouchableOpacity style={styles.emojiWrapper} onPress={() => handleEmojiPress(emoji)}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.ScrollView>
      )}
    </>
  );
}
