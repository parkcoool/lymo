import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  notification: {
    borderRadius: 20,
    padding: 12,
    gap: 8,
    backgroundColor: colors.surface,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },

  notificationTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 4,
  },

  notificationSource: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.onSurfaceSubtle,
  },

  notificationBody: {
    gap: 2,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.onSurface,
  },

  notificationContent: {
    fontSize: 14,
    color: colors.onSurfaceSubtle,
  },
});
