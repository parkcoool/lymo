import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    alignSelf: "stretch",
    backgroundColor: `${colors.primaryBackground}B3`,
  },

  track: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    width: "100%",
  },

  cover: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  trackMetadata: {
    flexDirection: "column",
    flex: 1,
  },

  title: {
    color: colors.onBackground,
    fontSize: 16,
    fontWeight: 700,
  },

  details: {
    color: colors.onBackgroundSubtle,
    fontSize: 14,
  },

  summary: {
    color: colors.onBackgroundSubtle,
    fontSize: 16,
  },
});
