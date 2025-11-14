import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  logoWrapper: {
    width: 24,
    height: 24,
  },

  text: {
    color: colors.onBackground,
    fontSize: 18,
    fontWeight: 700,
  },
});
