import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    minHeight: 400,
  },

  message: {
    color: colors.onBackground,
    textAlign: "center",
    fontSize: 16,
  },
});
