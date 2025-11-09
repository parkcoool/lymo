import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    minHeight: 400,
  },

  errorIcon: {
    color: colors.onBackground,
  },

  errorMessage: {
    color: colors.onBackground,
    textAlign: "center",
    fontSize: 16,
  },
});
