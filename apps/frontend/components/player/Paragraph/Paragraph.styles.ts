import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

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
  },

  note: {
    fontSize: 14,
    color: colors.black,
  },

  sentenceContainer: {
    flexDirection: "column",
    gap: 16,
    padding: 8,
    paddingTop: 0,
  },
});
