import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "stretch",
    gap: 2,
  },

  sentence: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.onBackgroundSubtle,
  },

  translation: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },

  translationWrapper: {
    minHeight: 24,
    justifyContent: "center",
  },

  highlight: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.onBackground,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  tooltip: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  tooltipBackground: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  },

  wordNoteSource: {
    fontSize: 10,
    color: colors.onBackgroundSubtle,
    fontWeight: 800,
  },

  wordNote: {
    fontSize: 12,
    color: colors.onBackground,
  },
});
