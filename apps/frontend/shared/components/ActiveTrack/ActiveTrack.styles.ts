import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  root: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },

  wrapper: {
    backdropFilter: "blur(16px)",
    borderRadius: 20,
    overflow: "hidden",
  },

  overlay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },

  left: {
    flexDirection: "column",
    flexGrow: 1,
    gap: 12,
  },

  syncIndicator: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  syncIcon: {
    color: colors.onBackgroundSubtle,
  },

  syncText: {
    color: colors.onBackgroundSubtle,
  },

  track: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  cover: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  trackMetadata: {
    flexDirection: "column",
    flexGrow: 1,
  },

  title: {
    color: colors.onBackground,
    fontSize: 16,
    fontWeight: 700,
  },

  artist: {
    color: colors.onBackgroundSubtle,
    fontSize: 14,
  },

  expandButton: {},

  expandIcon: {
    color: colors.onBackground,
  },
});
