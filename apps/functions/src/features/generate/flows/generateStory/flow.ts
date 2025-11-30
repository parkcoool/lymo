import { GeneratedStoryFields } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";

import ai from "@/core/genkit";

import { generateLyricsTranslationsFlow } from "../generateLyricTranslations";
import { generateSectionBreaksFlow } from "../generateSectionBreaks";
import { generateSectionNotesFlow } from "../generateSectionNotes/flow";
import { generateTrackOverviewFlow } from "../generateTrackOverview";

import { InputSchema, OutputSchema, StreamSchema } from "./schemas";

export const generateStoryFlow = ai.defineFlow(
  {
    name: "generateStoryFlow",
    inputSchema: InputSchema,
    streamSchema: StreamSchema,
    outputSchema: OutputSchema,
  },
  async ({ track, config: { lyricsProvider, language } }, { sendChunk }) => {
    // 1) 데이터 준비
    const lyrics = track.lyrics[lyricsProvider];
    if (!lyrics) throw new Error(ERROR_CODES.LYRICS_NOT_FOUND);

    const result: GeneratedStoryFields = {
      overview: "",
      sectionBreaks: [],
      sectionNotes: [],
      lyricTranslations: [],
    };

    await Promise.all([
      // 2) 섹션 구분 및 섹션 해석 생성
      (async () => {
        const sectionedLyrics: string[][] = [];

        // 2-1) 섹션 구분 생성
        {
          // 2-1-1) generateSectionBreaksFlow 실행
          const { output } = generateSectionBreaksFlow.stream({
            lyrics,
          });
          const sectionBreaks = await output;

          // 2-1-2) 섹션 구분에 따라 가사 분할
          let lastSectionBreak = -1;
          for (const sectionBreak of [...sectionBreaks, lyrics.length - 1]) {
            sectionedLyrics.push(
              lyrics.slice(lastSectionBreak + 1, sectionBreak + 1).map((lyric) => lyric.text)
            );
            lastSectionBreak = sectionBreak;
          }

          // 2-1-3) 결과 처리
          result.sectionBreaks = sectionBreaks;
          sendChunk({ sectionBreaks });
        }

        // 2-2) 섹션 해석 생성
        {
          // 2-2-1) generateSectionNotesFlow 실행
          const { output, stream } = generateSectionNotesFlow.stream({
            trackInfo: { title: track.title, artists: track.artists, album: track.album },
            lyrics: sectionedLyrics,
            config: { language },
          });
          let sectionNotes: (string | null)[] = [];

          // 2-2-2) 스트림 처리
          for await (const chunk of stream) {
            // type이 append인 경우
            if (chunk.type === "append") {
              const { sectionIndex, text } = chunk;
              if (typeof sectionNotes[sectionIndex] === "string")
                sectionNotes[sectionIndex] += text;
              else sectionNotes[sectionIndex] = text;
            }

            // type이 update인 경우
            else if (chunk.type === "update") {
              const { sectionIndex, text } = chunk;
              sectionNotes[sectionIndex] = text;
            }

            sendChunk({ sectionNotes });
          }

          // 2-2-3) 결과 처리
          sectionNotes = await output;
          result.sectionNotes = sectionNotes;
          sendChunk({ sectionNotes });
        }
      })(),

      // 3) 가사 해석 생성
      (async () => {
        // 3-1) generateLyricsTranslationsFlow 실행
        const { output, stream } = generateLyricsTranslationsFlow.stream({
          trackInfo: { title: track.title, artists: track.artists, album: track.album },
          lyrics,
          config: { language },
        });

        let lyricTranslations: (string | null)[] = [];

        // 3-2) 스트림 처리
        for await (const chunk of stream) {
          const { sentenceIndex, translation } = chunk;
          if (typeof lyricTranslations[sentenceIndex] === "string")
            lyricTranslations[sentenceIndex] += translation;
          else lyricTranslations[sentenceIndex] = translation;

          sendChunk({ lyricTranslations });
        }

        // 3-3) 결과 처리
        lyricTranslations = await output;
        result.lyricTranslations = lyricTranslations;
        sendChunk({ lyricTranslations });
      })(),

      // 4) 곡 개요 생성
      (async () => {
        // 4-1) generateTrackOverviewFlow 실행
        const { output, stream } = generateTrackOverviewFlow.stream({
          trackInfo: { title: track.title, artists: track.artists, album: track.album },
          lyrics: lyrics.map((lyric) => lyric.text),
          config: { language },
        });

        let overview: string = "";

        // 4-2) 스트림 처리
        for await (const chunk of stream) {
          overview += chunk;
          sendChunk({ overview });
        }

        // 4-3) 결과 처리
        overview = await output;
        result.overview = overview;
        sendChunk({ overview });
      })(),
    ]);

    // 5) 최종 결과 반환
    return result;
  }
);
