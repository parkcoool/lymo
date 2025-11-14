import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    alignItems: "stretch",
  },

  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  languageText: {
    fontSize: 16,
    color: colors.onBackground,
  },

  selected: {
    backgroundColor: `${colors.onBackground}33`,
  },

  checkIcon: {
    color: colors.onBackground,
    position: "absolute",
    right: 16,
  },
});
