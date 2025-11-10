export interface Setting {
  /**
   * 곡 별 가사 싱크 지연 시간 (ms)
   */
  trackSyncDelay: Map<string, number>;

  /**
   * 전체 가사 싱크 지연 시간 (ms)
   */
  globalSyncDelay: number;

  /**
   * 번역 대상 언어
   */
  translateTargetLanguage: Language;

  /**
   * 문단 요약 표시 여부
   */
  showParagraphSummary: boolean;
}

export type Language = "en" | "ko";
