import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    minHeight: 400,
  },

  message: {
    color: colors.onBackground,
    textAlign: "center",
    fontSize: 16,
  },
});
