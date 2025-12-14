import { LanguageSchema } from "@lymo/schemas/shared";

import { SettingJSON } from "../models/types";

/**
 * 주어진 객체가 `SettingJSON` 타입인지 검사하는 타입 가드 함수입니다.
 * @param obj 검사할 객체
 * @returns 객체가 `SettingJSON` 타입이면 `true`, 아니면 `false`
 */
export default function isSettingJSON(obj: unknown): obj is SettingJSON {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  if (!("sync" in obj) || !("language" in obj) || !("showSectionNotes" in obj)) {
    return false;
  }

  if (
    !obj.sync ||
    typeof obj.sync !== "object" ||
    Array.isArray(obj.sync) ||
    obj.sync instanceof Map
  ) {
    return false;
  }

  for (const value of Object.values(obj.sync)) {
    if (typeof value !== "number") {
      return false;
    }
  }

  if (!LanguageSchema.safeParse(obj.language).success) {
    return false;
  }

  if (typeof obj.showSectionNotes !== "boolean") {
    return false;
  }

  return true;
}
