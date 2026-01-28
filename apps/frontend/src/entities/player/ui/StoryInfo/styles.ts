import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
    height: 128,
  },

  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 28,
    height: 28,
  },

  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onBackground,
  },

  usernameSuffix: {
    fontSize: 16,
    color: colors.onBackground,
  },

  botIcon: {
    color: "#a5ffee",
  },

  textContainer: {
    flexDirection: "column",
    gap: 2,
  },

  botText: {
    fontSize: 18,
    fontWeight: "800",
  },

  warning: {
    fontSize: 14,
    color: colors.onBackgroundSubtle,
  },

  statContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },

  statIcon: {
    color: colors.onBackgroundSubtle,
  },

  filledFavoriteIcon: {
    color: "#ff6b81",
  },

  statText: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.onBackgroundSubtle,
    flexShrink: 1,
  },

  pressable: {
    borderRadius: 16,
    backgroundColor: `${colors.white}10`,
  },

  statWrapper: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  statContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  statSkeleton: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
  },
});
