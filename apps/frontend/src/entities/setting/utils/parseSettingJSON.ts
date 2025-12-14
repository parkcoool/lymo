import { Setting, SettingJSON } from "../models/types";

export default function parseSettingJSON(settingJSON: SettingJSON): Setting {
  return {
    ...settingJSON,
    sync: new Map(Object.entries(settingJSON.sync)),
  };
}
