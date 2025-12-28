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
    gap: 20,
  },

  itemContainer: {},

  icon: {
    color: colors.onBackgroundSubtle,
  },

  divider: {
    height: 1,
    backgroundColor: colors.onBackground,
    opacity: 0.1,
  },
});
