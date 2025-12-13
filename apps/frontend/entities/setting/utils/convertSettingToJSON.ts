import { Setting, SettingJSON } from "../models/types";

export default function convertSettingToJSON(setting: Setting): SettingJSON {
  return {
    ...setting,
    sync: Object.fromEntries(setting.sync),
  };
}
