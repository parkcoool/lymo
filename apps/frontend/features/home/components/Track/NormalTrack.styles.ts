import { StyleSheet } from "react-native";

import { colors } from "@/features/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    width: 320,
    borderRadius: 12,
    padding: 8,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  cover: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },

  textContainer: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onBackground,
  },

  artist: {
    fontSize: 14,
    color: colors.onBackgroundSubtle,
  },

  playIcon: {
    color: colors.onBackgroundSubtle,
  },
});
