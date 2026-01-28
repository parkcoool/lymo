import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 8,
  },

  modalBackground: {
    backgroundColor: colors.background,
  },

  modalHandleIndicator: {
    backgroundColor: colors.onBackgroundSubtle,
  },

  content: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.background,
  },

  top: {
    gap: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.onBackground,
  },

  description: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },

  footer: {
    alignSelf: "stretch",
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
