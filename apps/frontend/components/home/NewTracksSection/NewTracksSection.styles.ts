import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

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
    padding: 20,
    gap: 12,
    flexDirection: "row",
  },
});
