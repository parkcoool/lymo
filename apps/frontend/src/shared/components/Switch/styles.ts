import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 24,
    borderRadius: 16,
    overflow: "hidden",
  },

  track: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
});
