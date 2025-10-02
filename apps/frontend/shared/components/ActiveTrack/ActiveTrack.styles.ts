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
    backgroundColor: `${colors.primaryBackground}B3`,
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
    color: colors.onPrimaryBackground,
  },

  syncText: {
    color: colors.onPrimaryBackground,
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
    color: colors.onPrimaryBackground,
    fontSize: 16,
    fontWeight: 700,
  },

  artist: {
    color: colors.onPrimaryBackgroundSubtle,
    fontSize: 14,
  },

  expandButton: {},

  expandIcon: {
    color: colors.onPrimaryBackground,
  },
});
