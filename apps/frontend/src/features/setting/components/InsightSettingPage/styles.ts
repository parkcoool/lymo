import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    paddingTop: 60,
  },

  content: {
    paddingHorizontal: 20,
  },

  top: {
    gap: 8,
    paddingTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    color: colors.onBackground,
  },

  description: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },

  permissionContainer: {
    gap: 12,
  },

  optionContainer: {
    paddingVertical: 20,
    gap: 12,
    alignItems: "stretch",
  },

  option: {
    padding: 12,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  disabledOption: {
    opacity: 0.5,
  },

  optionLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.onBackgroundSubtle,
    padding: 4,
  },

  fill: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: colors.onBackgroundSubtle,
  },

  invisible: {
    opacity: 0,
  },

  optionRight: {
    gap: 2,
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: colors.onBackground,
  },

  optionDescription: {
    fontSize: 14,
    color: colors.onBackgroundSubtle,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    flex: 1,
  },

  buttonIcon: {
    color: colors.onSurface,
  },

  buttonText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: 700,
  },
});
