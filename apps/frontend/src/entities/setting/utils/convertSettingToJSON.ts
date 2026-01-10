import { Setting, SettingJSON } from "../models/types";

export default function convertSettingToJSON(setting: Setting): SettingJSON {
  // SettingJSON에는 notificationFrequency가 포함되지 않음
  const { notificationFrequency, ...rest } = setting;

  return {
    ...rest,
    sync: Object.fromEntries(setting.sync),
  };
}
