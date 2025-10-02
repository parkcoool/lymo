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
    flexDirection: "column",
    gap: 12,
    padding: 12,
    backgroundColor: `${colors.primaryBackground}B3`,
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
    width: "100%",
  },

  cover: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  trackMetadata: {
    flexDirection: "column",
    width: "100%",
  },

  title: {
    color: colors.onPrimaryBackground,
    fontSize: 16,
    fontWeight: 700,
    flex: 1,
  },

  artist: {
    color: colors.onPrimaryBackgroundSubtle,
    fontSize: 14,
    flex: 1,
  },
});
