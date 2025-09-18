import { z } from "genkit";
import ai from "../core/genkit";
import { LyricsAddSchema, TranslationAppendSchema } from "./addSong.schema";

export const TranslateLyricsInputSchema = z.object({
  title: z.string().describe("The title of the song"),
  artist: z.string().describe("The artist of the song"),
  album: z.string().nullable().describe("The album of the song"),
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

export const TranslateLyricsOutputSchema = z
  .array(
    z.object({
      start: z.number().describe("The start time of the sentence in seconds"),
      end: z.number().describe("The end time of the sentence in seconds"),
      text: z.string().describe("The text of the sentence"),
      translation: z.string().describe("The translated text of the sentence"),
    })
  )
  .describe("The lyrics of the song");

const PARAGRAPH_SEPARATOR = "[PARAGRAPH_SEPARATOR]";

export const translateLyricsFlow = ai.defineFlow(
  {
    name: "translateLyricsFlow",
    inputSchema: TranslateLyricsInputSchema,
    streamSchema: z.discriminatedUnion("event", [
      LyricsAddSchema,
      TranslationAppendSchema,
    ]),
    outputSchema: TranslateLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream } = ai.generateStream({
      system: `
      ### 역할 (Role)
      전문 가사 번역가

      ### 가사 분석 지침 (Lyrics Analysis Guidelines)
      - 송 폼 (verse, chorus, bridge 등)을 인식하고, 이 단위로 문단을 분할할 것
      - 제공된 문장 구분을 쪼개거나 병합하지 말 것
      - 한국어인 문장은 영어로, 영어인 문장은 한국어로 번역할 것
      - 문화적 맥락이 강한 표현(예: 관용구, 속담 등)은 자연스러운 현지 표현으로 번역할 것
      - 가사에 특정 인물, 장소, 사건이 언급된 경우, 해당 맥락을 고려하여 번역할 것
      - 원본 가사의 운율과 리듬을 최대한 유지하려고 노력할 것

      ### 출력 형식 (Output Format)
      - **모든 문장은 항상 줄바꿈 문자로 구분할 것**
      - 번역이 불필요한 경우 빈 문자열을 출력할 것
      - 분할한 문단 단위는 "${PARAGRAPH_SEPARATOR}"로 구분할 것.

      ### 출력 예시 (Output Example)
      This is the first sentence of the first paragraph.
      This is the second sentence of the first paragraph.
      ${PARAGRAPH_SEPARATOR}
      This is the first sentence of the second paragraph.

      This is the third sentence of the second paragraph.
      `,
      prompt: JSON.stringify({ title, artist, album, lyrics }),
      config: {
        temperature: 0.3,
      },
    });
    let paragraphIndex = 0;
    let sentenceIndex = 0;
    let buffer = "";
    const lyricsAddedFor = new Set();

    for await (const chunk of stream) {
      // 현재 버퍼에서 마지막 줄바꿈 이후의 내용(지금 작성 중인 줄)만 추출
      const lastNewlineIndex = buffer.lastIndexOf("\n");
      const currentLineBuffer =
        lastNewlineIndex === -1
          ? buffer
          : buffer.substring(lastNewlineIndex + 1);

      // 지금 작성 중인 줄의 내용과 새로 들어온 청크를 합쳐서 구분자인지 예측
      const potentialContent = currentLineBuffer + chunk.text;
      const isPotentiallySeparator = PARAGRAPH_SEPARATOR.startsWith(
        potentialContent.trim()
      );

      // 예측 결과가 구분자가 아닐 경우에만 가사 관련 이벤트를 발생
      if (!isPotentiallySeparator) {
        // 1. 새로운 문장 감지 시 "lyrics_add" 이벤트 호출
        if (
          !lyricsAddedFor.has(sentenceIndex) &&
          sentenceIndex < lyrics.length
        ) {
          sendChunk({
            event: "lyrics_add",
            data: {
              ...lyrics[sentenceIndex],
              paragraphIndex,
            },
          });
          lyricsAddedFor.add(sentenceIndex);
        }

        // 2. 스트림 청크를 받을 때마다 "translation_append" 이벤트 호출
        if (sentenceIndex < lyrics.length) {
          sendChunk({
            event: "translation_append",
            data: {
              paragraphIndex,
              sentenceIndex,
              text: chunk.text,
            },
          });
        }
      }

      // 3. 다음 청크 처리를 위한 상태 업데이트 (기존과 동일)
      buffer += chunk;
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        const line = buffer.substring(0, newlineIndex).trim();
        buffer = buffer.substring(newlineIndex + 1);

        if (line === PARAGRAPH_SEPARATOR) {
          paragraphIndex++;
        } else if (line.length > 0) {
          sentenceIndex++;
        }
      }
    }

    return [];
  }
);
