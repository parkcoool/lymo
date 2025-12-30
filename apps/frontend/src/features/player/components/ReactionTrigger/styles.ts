import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 20,
  },

  button: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    opacity: 0.8,
  },

  icon: {
    color: colors.black,
  },
});
