import { Setting } from "../models/types";

export default function getNotificationFrequencyText(frequency: Setting["notificationFrequency"]) {
  switch (frequency) {
    case "always":
      return "항상";
    case "normal":
      return "보통";
    case "minimal":
      return "최소한";
    case "never":
      return "안 함";
    default:
      return "";
  }
}
