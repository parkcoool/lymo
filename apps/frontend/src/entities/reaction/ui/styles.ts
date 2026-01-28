import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "30%",
    height: "100%",
    opacity: 0.5,
  },

  emojiWrapper: {
    position: "absolute",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    bottom: 30,
    right: 30,
  },

  emoji: {
    fontSize: 24,
  },
});
