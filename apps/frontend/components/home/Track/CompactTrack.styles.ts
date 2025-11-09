import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    width: 140,
    height: 140,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },

  cover: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.surface,
  },

  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "column-reverse",
    padding: 10,
  },

  title: {
    color: colors.white,
    fontSize: 14,
  },
});
