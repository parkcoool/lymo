/**
 * 여러 가사 문장들로 구성된 문단
 */
export interface LyricsParagraph {
  sentences: LyricsSentence[];
  summary: string | null;
}

/**
 * 가사 문장
 */
export interface LyricsSentence {
  text: string;
  translation: string;
  start: number;
  end: number;
}

/**
 * 여러 문단으로 구성된 가사
 */
export type Lyrics = LyricsParagraph[];
