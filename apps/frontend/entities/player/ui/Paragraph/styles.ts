import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    padding: 8,
    flexDirection: "column",
    gap: 16,
    alignSelf: "stretch",
    borderRadius: 16,
    overflow: "hidden",
  },

  noteWrapper: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: `${colors.white}80`,
    flexDirection: "column",
    gap: 8,
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  noteIcon: {
    color: colors.surface,
  },

  noteTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 800,
  },

  note: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
  },

  sentenceContainer: {
    flexDirection: "column",
    gap: 16,
    padding: 8,
    paddingTop: 0,
  },
});
