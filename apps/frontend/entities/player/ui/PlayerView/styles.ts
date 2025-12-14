import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },

  topContent: {
    display: "flex",
    gap: 16,
    paddingBottom: 16,
  },

  content: {
    flexDirection: "column",
    flex: 1,
    paddingBottom: 12,
    backgroundColor: "#000000CC",
  },
});
