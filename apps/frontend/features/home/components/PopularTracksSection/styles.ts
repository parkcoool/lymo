import { StyleSheet } from "react-native";

import { colors } from "@/features/shared/constants/colors";

export const styles = StyleSheet.create({
  section: {
    flexDirection: "column",
    paddingVertical: 8,
    alignSelf: "stretch",
  },

  sectionHeader: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    alignItems: "center",
  },

  sectionIcon: {
    color: colors.onBackground,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.onBackground,
  },

  sectionContent: {
    padding: 12,
    flexDirection: "row",
  },

  sectionContentContainer: {
    alignSelf: "flex-start",
  },

  sectionContentWrapper: {
    gap: 8,
  },

  skeletonColumn: {
    padding: 12,
    flexDirection: "column",
  },

  skeletonRow: {
    flexDirection: "row",
    gap: 8,
  },
});
