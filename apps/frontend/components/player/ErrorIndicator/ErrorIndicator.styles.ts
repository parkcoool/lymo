import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
    minHeight: 400,
  },

  header: {
    alignItems: "center",
    gap: 12,
  },

  errorIcon: {
    color: colors.onBackground,
  },

  errorMessage: {
    color: colors.onBackground,
    textAlign: "center",
    fontSize: 16,
  },

  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },

  retryButtonIcon: {
    color: colors.onSurface,
  },

  retryButtonContent: {
    color: colors.onSurface,
    fontSize: 16,
  },
});
