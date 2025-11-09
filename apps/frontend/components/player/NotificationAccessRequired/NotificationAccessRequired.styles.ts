import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: `${colors.primaryBackground}B3`,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  closeIcon: {
    color: colors.onPrimaryBackground,
  },

  body: {
    padding: 12,
    paddingBottom: 0,
    alignItems: "center",
    marginRight: 100,
  },

  description: {
    color: colors.onPrimaryBackground,
    fontSize: 16,
  },

  footer: {
    padding: 12,
    flexDirection: "column",
    gap: 12,
    alignSelf: "stretch",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
  },

  buttonIcon: {
    color: colors.onSurface,
  },

  buttonText: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: 700,
  },
});
