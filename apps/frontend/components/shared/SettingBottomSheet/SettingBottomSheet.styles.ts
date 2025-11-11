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

  content: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    alignItems: "stretch",
  },

  // Main
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

  // Sync
  syncIndicatorText: {
    marginVertical: 8,
    color: colors.onBackground,
    fontSize: 16,
    alignSelf: "center",
  },

  sliderWrapper: {
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
});
