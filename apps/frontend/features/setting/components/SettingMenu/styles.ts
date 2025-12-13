import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    alignItems: "stretch",
  },

  itemWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexDirection: "row",
  },

  itemIcon: {
    color: colors.onBackground,
  },

  itemText: {
    fontSize: 16,
    color: colors.onBackground,
  },

  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    color: colors.onBackgroundSubtle,
  },

  itemRightIcon: {
    color: colors.onBackgroundSubtle,
  },

  itemContent: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },
});
