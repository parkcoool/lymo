import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ReactionEmoji, ReactionEmojiSchema } from "@lymo/schemas/shared";
import { useState } from "react";
import { Text, TouchableOpacity, Vibration, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MediaNotificationListenerModule from "modules/media-notification-listener";
import useCreateEmojiReactionMutation from "@/entities/reaction/hooks/useCreateEmojiReactionMutation";

import { styles } from "./styles";

interface ReactionTriggerProps {
  storyId: string;
}

const slideInDown = SlideInDown.springify();
const slideOutDown = SlideOutDown.springify();

export default function ReactionTrigger({ storyId }: ReactionTriggerProps) {
  const { mutate: createEmojiReaction } = useCreateEmojiReactionMutation({ storyId });
  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleOpen = () => setIsOpen((prev) => !prev);

  const handleEmojiPress = async (emoji: ReactionEmoji) => {
    Vibration.vibrate(10);
    const timestampInSeconds = (await MediaNotificationListenerModule.getCurrentPosition()) / 1000;

    createEmojiReaction({ timestampInSeconds, emoji });
  };

  return (
    <>
      <View style={[styles.triggerWrapper, { bottom: bottom + 20 }]}>
        <Animated.View entering={slideInDown} exiting={slideOutDown}>
          <TouchableOpacity style={styles.button} onPress={handleToggleOpen}>
            <MaterialIcons style={styles.icon} size={20} name="add-reaction" />
          </TouchableOpacity>
        </Animated.View>
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
