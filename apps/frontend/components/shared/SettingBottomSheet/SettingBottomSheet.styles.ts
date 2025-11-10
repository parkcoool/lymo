import { act } from "react";
import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 8,
  },

  modalBackground: {
    backgroundColor: colors.background,
  },

  modalContent: {
    borderRadius: 12,
    backgroundColor: colors.background,
  },

  modalHandleIndicator: {
    backgroundColor: colors.onBackgroundSubtle,
  },

  // Main
  actionContainer: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    alignItems: "stretch",
  },

  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionButtonLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexDirection: "row",
  },

  actionButtonIcon: {
    color: colors.onBackground,
  },

  actionButtonText: {
    fontSize: 16,
    color: colors.onBackground,
  },

  actionButtonRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    color: colors.onBackgroundSubtle,
  },

  actionButtonRightIcon: {
    color: colors.onBackgroundSubtle,
  },

  actionButtonContent: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },
});
