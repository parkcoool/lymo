import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    flexDirection: "column",
    gap: 16,
    alignSelf: "stretch",
    borderRadius: 16,
  },

  summaryWrapper: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: `${colors.surface}B3`,
  },

  summary: {
    fontSize: 14,
    color: colors.onSurface,
  },

  sentenceContainer: {
    flexDirection: "column",
    gap: 16,
  },
});
