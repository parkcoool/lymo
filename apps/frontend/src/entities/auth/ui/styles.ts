import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: colors.onBackground,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    color: colors.black,
    opacity: 0.5,
  },
});
