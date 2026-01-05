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
  },

  tooltip: {
    borderRadius: 12,
    overflow: "hidden",
  },

  tooltipBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },

  wordNoteSource: {
    fontSize: 12,
    color: colors.onBackgroundSubtle,
    fontWeight: 700,
  },

  wordNote: {
    fontSize: 14,
    color: colors.onBackground,
  },
});
