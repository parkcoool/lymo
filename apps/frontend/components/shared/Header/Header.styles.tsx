import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 16,
    padding: 16,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  buttonIcon: {
    color: colors.onBackground,
  },

  searchBox: {
    flex: 1,
  },

  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
});
