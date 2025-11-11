import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },

  button: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    opacity: 0.7,
  },

  icon: {
    color: colors.onSurface,
  },
});
