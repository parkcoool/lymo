import { z } from "genkit";
import ai from "../core/genkit";

export const translateLyricsInputSchema = z.object({
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

export const translateLyricsOutputSchema = z.array(
  z.array(
    z.object({
      start: z.number().describe("The start time of the sentence in seconds"),
      end: z.number().describe("The end time of the sentence in seconds"),
      text: z.string().describe("The original text of the sentence"),
      translation: z
        .string()
        .nullable()
        .describe("The translated text of thesentence"),
    })
  )
);

export type ParsedParagraph = z.infer<
  typeof translateLyricsOutputSchema
>[number];

export type ParsedSentence = ParsedParagraph[number];

export const translateLyricsFlow = ai.defineFlow(
  {
    name: "translateLyricsFlow",
    inputSchema: translateLyricsInputSchema,
    streamSchema: translateLyricsOutputSchema,
    outputSchema: translateLyricsOutputSchema,
  },
  async ({ title, artist, album, lyrics }, { sendChunk }) => {
    const { stream } = ai.generateStream({
      system: `
      ### 역할 (Role)
      전문 가사 번역가

      #### 가사 분석 지침 (Lyrics Analysis Guidelines)
      - 송 폼 (verse, chorus, bridge 등)을 인식하고, 이 단위로 문단을 분할할 것
      - 제공된 문장 구분을 쪼개거나 병합하지 말 것
      - 한국어인 문장은 영어로, 영어인 문장은 한국어로 번역할 것
      - 문화적 맥락이 강한 표현(예: 관용구, 속담 등)은 자연스러운 현지 표현으로 번역할 것
      - 가사에 특정 인물, 장소, 사건이 언급된 경우, 해당 맥락을 고려하여 번역할 것
      - 원본 가사의 운율과 리듬을 최대한 유지하려고 노력할 것

      ### 출력 형식 (Output Format)
      - **모든 문장은 항상 줄바꿈 문자로 구분할 것**
      - 주어지는 가사 문장들은 문장 번호와 함께 제공되며, 번역 시 문장 번호를 대괄호 안에 포함할 것 (예: [3] 번역된 문장입니다.)
      - 번역이 불필요한 경우 "null"을 출력할 것
      - 분할한 문단 단위는 "[PARAGRAPH_SEPARATOR]"로 구분할 것.

      ### 출력 예시 (Output Example)
      [1] This is the first sentence.
      [2] null
      [PARAGRAPH_SEPARATOR]
      [3] This is the third sentence.
      [4] This is the fourth sentence.
      `,
      prompt: JSON.stringify({
        title,
        artist,
        album,
        lyrics: lyrics.map((sentence, index) => [index, sentence.text]),
      }),
      config: {
        temperature: 0.3,
      },
    });

    // 전체 번역 결과를 저장할 배열
    const result: ParsedParagraph[] = [];
    // 스트리밍 텍스트 데이터를 임시로 저장할 버퍼
    let buffer = "";

    // 스트림에서 청크를 순회하며 처리
    for await (const chunk of stream) {
      buffer += chunk.text;

      const parts = buffer.split("[PARAGRAPH_SEPARATOR]");
      // 마지막 부분은 아직 완성되지 않은 문단일 수 있으므로 버퍼에 남겨둠
      buffer = parts.pop() ?? "";

      // 완성된 문단들을 순회하며 처리
      for (const part of parts) {
        const sentences = part.split("\n");
        const parsedSentences: ParsedSentence[] = [];

        // 각 문장에 대해 원본 가사와 매칭하여 번역 결과 생성
        for (const sentence of sentences) {
          const trimmed = sentence.trim();
          if (trimmed === "null") continue; // 번역이 불필요한 문장은 건너뜀

          const match = trimmed.match(/^\[(\d+)\]\s*(.*)$/);
          if (!match) continue; // 패턴이 일치하지 않는 문장은 건너뜀

          const index = parseInt(match[1], 10);
          if (isNaN(index) || index < 0 || index >= lyrics.length) continue; // 유효하지 않은 인덱스는 건너뜀

          const original = lyrics[index];
          parsedSentences.push({
            start: original.start,
            end: original.end,
            text: original.text,
            translation: match[2].trim(),
          });
        }

        result.push(parsedSentences);
        // 현재까지 처리된 결과를 청크로 전송
        sendChunk(result);
      }
    }

    // 버퍼에 남아있는 마지막 문단 처리
    if (buffer.trim() !== "") {
      const sentences = buffer.split("\n");
      const parsedSentences: ParsedSentence[] = [];

      for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (trimmed === "null") continue; // 번역이 불필요한 문장은 건너뜀
        const match = trimmed.match(/^\[(\d+)\]\s*(.*)$/);
        if (!match) continue; // 패턴이 일치하지 않는 문장은 건너뜀
        const index = parseInt(match[1], 10);
        if (isNaN(index) || index < 0 || index >= lyrics.length) continue; // 유효하지 않은 인덱스는 건너뜀
        const original = lyrics[index];
        parsedSentences.push({
          start: original.start,
          end: original.end,
          text: original.text,
          translation: match[2].trim(),
        });
      }
      result.push(parsedSentences);
      sendChunk(result);
    }

    return result;
  }
);
