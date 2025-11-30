import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%)",
  },

  button: {
    height: 48,
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    opacity: 0.7,
  },

  text: {
    fontSize: 16,
    color: colors.black,
  },

  icon: {
    color: colors.black,
  },
});
