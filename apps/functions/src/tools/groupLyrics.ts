import { z } from "genkit";

import ai from "@/core/genkit";
import averageEmbeddings from "@/utils/averageEmbeddings";
import calculateCosineDistance from "@/utils/calculateCosineDistance";
import getSyllableCount from "@/utils/getSyllableCount";
import normalize from "@/utils/normalize";

export const GroupLyricsInputSchema = z.object({
  lyrics: z
    .array(
      z.object({
        start: z.number().describe("The start time of the sentence in seconds"),
        end: z.number().describe("The end time of the sentence in seconds"),
        text: z.string().describe("The text of the sentence"),
      })
    )
    .describe("The lyrics of the song"),
});

export const GroupLyricsOutputSchema = z.array(
  z.number().describe("An index where paragraphs should break")
);

const SEMANTIC_WEIGHT = 0.7;
const TIME_WEIGHT = 0.3;
const WINDOW_SIZE = 3;

export const groupLyrics = ai.defineTool(
  {
    name: "groupLyrics",
    inputSchema: GroupLyricsInputSchema,
    outputSchema: GroupLyricsOutputSchema,
    description: "Groups the translated lyrics into paragraphs.",
  },
  async ({ lyrics }) => {
    if (lyrics.length <= 1) return [];

    const texts = lyrics.map((line) => line.text);
    const embeddings = (
      await ai.embedMany({
        embedder: "googleai/text-embedding-004",
        content: texts,
      })
    ).map((e) => e.embedding);

    const timeScores: number[] = [];
    const semanticScores: number[] = [];

    // 문장 i와 i+1 사이의 단절을 평가
    for (let i = 0; i < lyrics.length - 1; i++) {
      // 시간 점수 계산 (이전과 동일)
      const duration = lyrics[i].end - lyrics[i].start;
      const syllables = getSyllableCount(lyrics[i].text) || 1;
      timeScores.push(duration / syllables);

      // 의미 점수 계산 (롤링 윈도우 적용)
      const prevWindowStart = Math.max(0, i - WINDOW_SIZE + 1);
      const prevWindowEmbeddings = embeddings.slice(prevWindowStart, i + 1);

      const nextWindowEnd = Math.min(lyrics.length, i + 1 + WINDOW_SIZE);
      const nextWindowEmbeddings = embeddings.slice(i + 1, nextWindowEnd);

      const avgPrevEmbedding = averageEmbeddings(prevWindowEmbeddings);
      const avgNextEmbedding = averageEmbeddings(nextWindowEmbeddings);

      if (avgPrevEmbedding.length > 0 && avgNextEmbedding.length > 0) {
        semanticScores.push(calculateCosineDistance(avgPrevEmbedding, avgNextEmbedding));
      } else {
        semanticScores.push(0); // 비교할 데이터가 없으면 0점
      }
    }

    const normalizedTime = normalize(timeScores);
    const normalizedSemantic = normalize(semanticScores);

    const breakScores = normalizedTime.map(
      (ts, i) => ts * TIME_WEIGHT + normalizedSemantic[i] * SEMANTIC_WEIGHT
    );

    // 동적 목표 설정
    const TARGET_LINES_PER_PARA_LOW = 4;
    const TARGET_LINES_PER_PARA_HIGH = 7;
    const targetParagraphCount = Math.round(
      lyrics.length / ((TARGET_LINES_PER_PARA_LOW + TARGET_LINES_PER_PARA_HIGH) / 2)
    );
    const breakCount = Math.max(0, targetParagraphCount - 1);

    const breaks = breakScores
      .map((score, index) => ({ score, index }))
      .sort((a, b) => b.score - a.score)
      .slice(0, breakCount)
      .map((item) => item.index)
      .sort((a, b) => a - b);

    return breaks;
  }
);
