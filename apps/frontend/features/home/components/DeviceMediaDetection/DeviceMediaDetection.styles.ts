import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    backgroundColor: colors.primaryBackground,
    borderRadius: 16,
    overflow: "hidden",
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  closeIcon: {
    color: colors.onPrimaryBackground,
  },

  track: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
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

  footer: {
    padding: 12,
    flexDirection: "column",
    gap: 8,
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  description: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  castICon: {
    color: colors.onPrimaryBackground,
  },

  descriptionText: {
    color: colors.onPrimaryBackground,
    fontSize: 16,
  },

  playButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
  },

  playIcon: {
    color: colors.onSurface,
  },

  playButtonText: {
    color: colors.onSurface,
    fontSize: 16,
  },
});
