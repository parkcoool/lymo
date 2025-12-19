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
    height: 400,
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#00000040",
  },

  body: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 28,
    gap: 12,
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
  },

  ringsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#ffffff",
  },
});
