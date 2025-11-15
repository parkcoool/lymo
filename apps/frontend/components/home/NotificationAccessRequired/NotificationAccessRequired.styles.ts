import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.primary,
    flexDirection: "column",
    alignItems: "flex-start",
    height: 400,
    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000080",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 20,
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
    alignSelf: "stretch",
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

  // Preview
  previewContainer: {
    overflow: "hidden",
    width: "100%",
    gap: 8,
    padding: 20,
  },
});
