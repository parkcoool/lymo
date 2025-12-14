import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    gap: 16,
    alignSelf: "stretch",
  },

  overview: {
    color: colors.onBackgroundSubtle,
    fontSize: 16,
    marginHorizontal: 16,
    lineHeight: 24,
  },

  overviewSkeletonContainer: {
    marginHorizontal: 16,
    flexDirection: "column",
    gap: 8,
  },

  overviewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  overviewButtonContent: {
    color: colors.onBackground,
  },

  invisible: {
    opacity: 0,
  },
});
