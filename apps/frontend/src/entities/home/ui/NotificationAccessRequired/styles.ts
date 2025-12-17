import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.surface,
    flexDirection: "column",
    alignItems: "flex-start",
    height: 400,
    boxShadow: "0 4px 32px rgba(255, 255, 255, 0.1)",
  },

  background: {
    position: "relative",
    width: "100%",
    height: "100%",
  },

  mock1: {
    position: "absolute",
    top: 0,
    right: -100,
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },

  mock2: {
    position: "absolute",
    top: 12,
    left: -20,
    width: "60%",
    height: "60%",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000040",
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
    gap: 12,
  },

  titleWrapper: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  titleIcon: {
    color: "#a9ffef",
  },

  title: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: "center",
  },

  descriptionText: {
    color: colors.onSurfaceSubtle,
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    lineHeight: 22,
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
    gap: 16,
    padding: 20,
  },
});
