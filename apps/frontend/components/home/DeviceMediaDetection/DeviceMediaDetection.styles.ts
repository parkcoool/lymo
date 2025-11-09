import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

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

  header: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    padding: 16,
    paddingBottom: 0,
  },

  headerIcon: {
    color: colors.onPrimaryBackground,
  },

  headerText: {
    color: colors.onPrimaryBackground,
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  closeIcon: {
    color: colors.onPrimaryBackground,
  },

  trackWrapper: {
    alignSelf: "stretch",
  },

  track: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    paddingBottom: 0,
    alignItems: "center",
    overflow: "hidden",
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
