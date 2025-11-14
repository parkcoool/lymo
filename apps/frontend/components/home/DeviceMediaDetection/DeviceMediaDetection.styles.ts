import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    position: "relative",
    borderRadius: 16,
    backgroundColor: colors.black,
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

  coverWrapper: {
    position: "relative",
    width: "100%",
    height: 300,
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
    bottom: 0,
    left: 16,
    right: 16,
    flexDirection: "column",
    flex: 1,
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

  footer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },

  information: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingBottom: 0,
  },

  informationIcon: {
    color: colors.onPrimaryBackground,
  },

  informationText: {
    color: colors.onPrimaryBackground,
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
