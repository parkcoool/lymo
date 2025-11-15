import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: `${colors.surface}`,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  closeIcon: {
    color: colors.onSurface,
  },

  body: {
    padding: 20,
    gap: 20,
    paddingBottom: 0,
  },

  title: {
    color: colors.onSurface,
    fontSize: 24,
    fontWeight: 700,
  },

  descriptionContainer: {
    gap: 8,
  },

  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },

  descriptionIcon: {
    color: colors.onSurfaceSubtle,
  },

  descriptionText: {
    color: colors.onSurfaceSubtle,
    fontSize: 16,
    flex: 1,
  },

  footer: {
    padding: 12,
    flexDirection: "column",
    gap: 12,
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    flex: 1,
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
