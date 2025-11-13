import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    alignItems: "stretch",
  },

  syncIndicatorText: {
    marginVertical: 8,
    color: colors.onBackground,
    fontSize: 16,
    alignSelf: "center",
  },

  bottom: {
    display: "flex",
    gap: 12,
  },

  controller: {
    padding: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  arrowButton: {
    backgroundColor: colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  arrowIcon: {
    color: colors.onSurface,
  },

  slider: {
    flex: 1,
  },

  resetButtonWrapper: {
    padding: 8,
  },

  resetButton: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  resetButtonText: {
    color: colors.onSurface,
    fontSize: 16,
  },
});
