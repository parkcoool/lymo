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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  tooltip: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: "70%",
    alignSelf: "flex-start",
  },

  tooltipText: {
    fontSize: 12,
    color: colors.black,
    fontWeight: "500",
  },
});
