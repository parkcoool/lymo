import { Setting } from "../models/types";

export default function getNotificationFrequencyText(frequency: Setting["notificationFrequency"]) {
  switch (frequency) {
    case "always":
      return "항상";
    case "normal":
      return "보통";
    case "minimal":
      return "가끔";
    case "never":
      return "없음";
    default:
      return "설정 안 함";
  }
}
