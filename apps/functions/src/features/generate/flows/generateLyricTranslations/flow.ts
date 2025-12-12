import { logger } from "firebase-functions";
import { z } from "genkit";

import ai from "@/core/genkit";
import calculateSimilarity from "@/features/shared/utils/calculateSimilarity";
import getLanguageName from "@/features/shared/utils/getLanguageName";

import { InputSchema, StreamSchema, OutputSchema } from "./schemas";
import { detectLanguage } from "./utils";

const MAX_RETRIES = 3;

export const generateLyricsTranslationsFlow = ai.defineFlow(
  {
    name: "generateLyricsTranslationsFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ lyrics, config: { language } }, { sendChunk }) => {
    // 1) 이미 목표 언어인 문장 필터링
    const needsTranslation = lyrics.map((lyric) => {
      const detectedLang = detectLanguage(lyric.text);
      return detectedLang !== language;
    });

    // 번역 결과 후처리 함수
    const validateTranslation = (index: number, translation?: string | null): string | null => {
      if (!needsTranslation[index]) return null;
      if (!translation || translation.trim() === "null") return null;

      const similarity = calculateSimilarity(lyrics[index].text, translation);
      if (similarity > 0.8) return null;

      return translation;
    };

    let result: (string | null)[] = new Array(lyrics.length).fill(null);
    let retry = 0;

    while (retry < MAX_RETRIES) {
      try {
        // 1) AI 번역 요청 및 스트리밍
        const { stream, response } = ai.generateStream({
          system: `
          ### Identity
          You are an expert in translating song lyrics.

          ### Input Format Specification
          You will receive a JSON object containing:
          1. \`targetLanguage\`: The specific language you must translate the lyrics into.
          2. \`lyrics\`: An array of objects, each with:
              - \`index\`: The position of the lyric in the original song.
              - \`text\`: The actual lyric text to be translated.

          ### Core Principles
          - Prioritize adaptation, avoid literal translation: Avoid mechanical word-for-word translation.
          - Cultural Transcendence: Re-create idioms and slang into natural expressions in the \`targetLanguage\`.

          ### Constraints
          - **CRITICAL RULE 1 (Language Enforcement):** You MUST translate the input lyrics into the language specified in the \`targetLanguage\` field of the input JSON.
              - Even if the input is mixed, the output must be solely in the \`targetLanguage\`.
          - **CRITICAL RULE 2 (Already Translated):** If an input sentence is ALREADY in the \`targetLanguage\`, return \`null\`. Do not repeat it.
          - **CRITICAL RULE 3 (Ad-libs):** If an input sentence consists **ENTIRELY** of non-semantic vocalizations (e.g., "Ooh", "Yeah", "La-la-la"), return \`null\`.
              - Exception: If ad-libs are mixed with words (e.g., "I love you (ooh)"), translate the sentence normally.
          - Do not arbitrarily combine or separate the sentence divisions.

          ### Output Format
          Your output MUST be a JSON array where each element corresponds to the input lyrics by \`index\`. Each element must be an object containing:
          - \`index\`: The index of the lyric as provided in the input.
          - \`text\`: The translated lyric text, or \`null\` if no translation is needed as per the rules above.

          ### Output Example
          **User Input:**
          \`\`\`json
          {
            "targetLanguage": "Korean",
            "lyrics": [
              {"index": 0, "text": "Hello world"},
              {"index": 1, "text": "It's a beautiful day"},
              {"index": 2, "text": "Ooh yeah"},
              {"index": 3, "text": "아름다운 날이야"}
            ]
          }
          \`\`\`

          **Model Output:**
          \`\`\`json
          [
            {"index": "0", "text": "안녕 세상아"},
            {"index": "1", "text": "아름다운 날이야"},
            {"index": "2", "text": null},
            {"index": "3", "text": null}
          ]
          \`\`\`
        `,
          model: "googleai/gemini-2.5-flash-lite",
          prompt: JSON.stringify({
            lyrics: lyrics.map((lyric, index) => ({ index, text: lyric.text })),
            targetLanguage: getLanguageName(language),
          }),
          output: {
            schema: z.object({ index: z.number(), text: z.string().nullable() }).array(),
          },
          config: {
            temperature: Math.max(0.1, 0.4 - (retry * 0.3) / MAX_RETRIES),
          },
        });

        // 2) 스트리밍 처리
        let index = 0;
        for await (const chunk of stream) {
          // 2-1) 번역 결과가 존재하지 않으면 건너뜀
          const translations = chunk.output;
          if (!translations || translations.length === 0) continue;

          // 2-2) 번역 결과 유효성 검사 및 전송
          for (; index < translations.length; index++) {
            const validated = validateTranslation(index, translations[index].text);
            result[index] = validated;
            sendChunk({ sentenceIndex: index, translation: validated });

            // 마지막 번역은 완전하지 않을 수 있으므로 조기 break
            if (index >= translations.length - 1) break;
          }
        }

        // 3) 최종 결과 처리
        const { output } = await response;

        // 3-1) 번역 문장 개수가 맞지 않는 경우 재시도
        if (output?.length !== lyrics.length) {
          retry++;
          continue;
        }

        // 3-2) 번역 결과 유효성 검사 및 반환
        result = output.map((item) => validateTranslation(item.index, item.text));
        return result;
      } catch (error) {
        logger.error(`generateLyricsTranslationsFlow: Attempt ${retry} failed`, error);
      }

      // 5) 실패 시 재시도
      retry++;
    }

    logger.warn(`generateLyricsTranslationsFlow: translation count mismatch after retries.`, {
      expected: lyrics.length,
      retries: retry,
    });

    return result;
  }
);
