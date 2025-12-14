import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignSelf: "stretch",
    gap: 2,
  },

  sentence: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.onBackgroundSubtle,
  },

  translation: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },
});
