import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
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

  infoContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "column",
    flex: 1,
    gap: 4,
  },

  title: {
    color: colors.onBackground,
    fontSize: 32,
    fontWeight: 800,
  },

  metadata: {
    color: colors.onBackgroundSubtle,
    fontSize: 16,
  },
});
