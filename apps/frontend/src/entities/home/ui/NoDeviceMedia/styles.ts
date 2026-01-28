import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "column",
    height: 400,
  },

  body: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 8,
  },

  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  titleIcon: {
    color: colors.onSurface,
  },

  title: {
    fontSize: 28,
    fontWeight: 800,
    color: colors.onSurface,
    textAlign: "center",
  },

  descriptionText: {
    color: colors.onSurfaceSubtle,
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    textAlign: "center",
  },

  // Background
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },

  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ffffff",
  },

  glow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    boxShadow: `0 0 80px 80px ${colors.white}`,
    opacity: 0.08,
  },
});
