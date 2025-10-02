import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
  },

  overlay: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: `${colors.primaryBackground}B3`,
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
    paddingBottom: 0,
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
    gap: 12,
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  description: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  castIcon: {
    color: colors.onPrimaryBackground,
  },

  descriptionText: {
    color: colors.onPrimaryBackground,
    fontSize: 16,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
  },

  buttonIcon: {
    color: colors.onSurface,
  },

  buttonText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: 700,
  },
});
