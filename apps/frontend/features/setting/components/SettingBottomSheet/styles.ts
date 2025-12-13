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
    backgroundColor: colors.background,
  },
});
