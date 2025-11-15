import { StyleSheet } from "react-native";

import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 40,
  },

  providerNameWrapper: {
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  providerNameIcon: {
    color: colors.onBackground,
  },

  providerNameText: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.onBackground,
  },

  divider: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.onBackgroundSubtle,
  },

  providerUpdatedAtText: {
    fontSize: 16,
    color: colors.onBackgroundSubtle,
  },
});
