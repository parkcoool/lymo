import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    gap: 16,
    alignSelf: "stretch",
    paddingBottom: 16,
  },

  coverWrapper: {
    position: "relative",
  },

  cover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  coverGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  trackMetadata: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "column",
    flex: 1,
    gap: 4,
  },

  title: {
    color: colors.onBackground,
    fontSize: 32,
    fontWeight: 800,
  },

  details: {
    color: colors.onBackgroundSubtle,
    fontSize: 16,
  },

  summary: {
    color: colors.onBackgroundSubtle,
    fontSize: 16,
    marginHorizontal: 16,
    lineHeight: 24,
  },

  summarySkeleton: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingHorizontal: 16,
  },

  summaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  summaryButtonContent: {
    color: colors.onBackground,
  },

  invisible: {
    position: "absolute",
    opacity: 0,
  },
});
