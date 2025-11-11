import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translate(-50%)",
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    opacity: 0.7,
  },

  text: {
    fontSize: 16,
    color: colors.onSurface,
  },

  icon: {
    color: colors.onSurface,
  },
});
