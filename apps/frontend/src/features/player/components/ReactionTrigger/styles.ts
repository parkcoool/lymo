import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  triggerWrapper: {
    position: "absolute",
    right: 20,
  },

  button: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    opacity: 0.8,
  },

  icon: {
    color: colors.black,
  },

  // emojiContainer

  emojiContainer: {
    position: "absolute",
    right: 20,
    width: 48,
    maxHeight: 240,
    borderRadius: 24,
    overflow: "hidden",
  },

  emojiContentContainer: {
    alignItems: "center",
    gap: 12,
  },

  emojiWrapper: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: `${colors.white}80`,
  },

  emoji: {
    fontSize: 24,
  },
});
