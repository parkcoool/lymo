import { StyleSheet } from "react-native";

import { colors } from "@/features/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  lyrics: {
    padding: 8,
    paddingBottom: 80,
    gap: 20,
  },

  lyricsProviderWrapper: {
    paddingHorizontal: 16,
  },

  lyricsProviderText: {
    fontSize: 12,
    color: colors.onBackgroundSubtle,
  },
});
