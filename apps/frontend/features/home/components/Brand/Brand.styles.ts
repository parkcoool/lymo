import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  logoWrapper: {
    width: 40,
    height: 40,
  },

  text: {
    color: colors.onBackground,
    fontSize: 24,
    fontWeight: 700,
  },
});
