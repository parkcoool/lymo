import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },

  left: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onBackground,
  },

  description: {
    fontSize: 14,
    color: colors.onBackgroundSubtle,
  },

  icon: {
    color: colors.onBackgroundSubtle,
  },

  disabledWrapper: {
    opacity: 0.5,
  },
});
