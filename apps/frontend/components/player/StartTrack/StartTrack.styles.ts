import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 20,
  },

  button: {
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    opacity: 0.7,
  },

  icon: {
    color: colors.black,
  },
});
