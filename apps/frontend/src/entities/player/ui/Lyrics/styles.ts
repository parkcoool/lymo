import { StyleSheet } from "react-native";

import { colors } from "@/shared/constants/colors";

export const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },

  lyrics: {
    padding: 8,
    gap: 20,
  },

  lyricsProviderWrapper: {
    paddingHorizontal: 16,
  },

  lyricsProviderText: {
    fontSize: 12,
    marginHorizontal: 8,
    color: colors.onBackgroundSubtle,
  },
});
