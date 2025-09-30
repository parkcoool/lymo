import { StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },

  safeAreaView: {},

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

  searchBoxWrapper: {
    flex: 1,
    height: "100%",
  },

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

  right: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
});
