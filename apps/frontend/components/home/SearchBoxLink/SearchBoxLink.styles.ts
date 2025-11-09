import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    borderRadius: 32,
    backgroundColor: colors.surface,
  },

  searchBoxText: {
    color: colors.onSurfaceSubtle,
    fontSize: 16,
  },

  searchBoxIcon: {
    color: colors.onSurfaceSubtle,
  },
});
