import { Language } from "@lymo/schemas/shared";

export interface Setting {
  /**
   * 곡 별 가사 싱크 지연 시간 (ms)
   */
  sync: Map<string, number>;

  /**
   * 번역 대상 언어
   */
  language: Language;

  /**
   * 문단 요약 표시 여부
   */
  showSectionNotes: boolean;

  /**
   * 알림 표시 빈도
   */
  notificationFrequency?: "always" | "normal" | "minimal" | "never";
}

/**
 * AsyncStorage에 저장하기 위한 JSON 형태의 `Setting` 타입
 */
export type SettingJSON = Omit<Setting, "sync" | "notificationFrequency"> & {
  /**
   * 곡 별 가사 싱크 지연 시간 (ms)
   */
  sync: Record<string, number>;
};

export type SettingViews = "menu" | "sync" | "language";
