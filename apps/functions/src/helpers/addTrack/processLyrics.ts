
import type {
  LyricsGroupEvent,
  ParagraphSummaryAppendEvent,
  TranslationSetEvent,
} from "@lymo/schemas/event";
import type { Lyrics } from "@lymo/schemas/shared";
import type { StreamingCallback } from "genkit";

import { summarizeParagraphFlow } from "../../flows/summarizeParagraph.flow";
import { translateLyricsFlow } from "../../flows/translateLyrics.flow";
import { groupLyrics } from "../../tools/groupLyrics";
import type { LRCLIBResult } from "../../types/lrclib";
import type { SpotifyResult } from "../../types/spotify";
import findIndex from "../../utils/findIndex";

export default async function processLyrics(
  sendChunk: StreamingCallback<
    TranslationSetEvent | LyricsGroupEvent | ParagraphSummaryAppendEvent
  >,
  spotifyResult: SpotifyResult,
  lrclibResult: LRCLIBResult
) {
  // 가사 번역을 위해 `translateLyricsFlow` 플로우 실행
  const { stream: translateLyricsStream, output: translateLyricsOutput } =
    translateLyricsFlow.stream({
      title: spotifyResult.title,
      artist: spotifyResult.artist.join(", "),
      album: spotifyResult.album,
      lyrics: lrclibResult.lyrics,
    });

  // 문단 구분을 위해 `groupLyrics` 툴 실행
  const groupLyricsPromise = groupLyrics({ lyrics: lrclibResult.lyrics });

  // 반환할 가사 데이터
  const lyrics: Lyrics = [];

  // 가사 번역 스트림과 문단 구분을 병렬로 처리
  await Promise.all([
    // 가사 번역 스트림 처리
    (async () => {
      for await (const chunk of translateLyricsStream) {
        sendChunk(chunk);
      }
    })(),

    // 문단 구분 처리
    (async () => {
      const breaks = await groupLyricsPromise;
      sendChunk({ event: "lyrics_group", data: breaks });

      // lyrics에 문단 구분 반영
      let lastBreak = -1;
      for (const breakIndex of breaks) {
        lyrics.push({
          sentences: lrclibResult.lyrics
            .slice(lastBreak + 1, breakIndex + 1)
            .map((s) => ({ ...s, translation: null })),
          summary: null,
        });
        lastBreak = breakIndex;
      }
      lyrics.push({
        sentences: lrclibResult.lyrics
          .slice(lastBreak + 1)
          .map((s) => ({ ...s, translation: null })),
        summary: "",
      });
    })(),
  ]);

  // 가사 번역 반영
  const translations = await translateLyricsOutput;
  for (let i = 0; i < translations.length; i++) {
    const { outer: p, inner: s } = findIndex(
      lyrics.map((paragraph) => paragraph.sentences),
      i
    )!;
    lyrics[p].sentences[s].translation = translations[i];
  }

  // 문단 별 해석 생성을 위해 `summarizeParagraphFlow` 플로우 실행
  const { stream: summarizeParagraphStream, output: summarizeParagraphOutput } =
    summarizeParagraphFlow.stream({
      title: spotifyResult.title,
      artist: spotifyResult.artist.join(", "),
      album: spotifyResult.album,
      lyrics: lyrics.map((paragraph) => paragraph.sentences.map((s) => s.text)),
    });

  // summarizeParagraphStream 처리
  for await (const chunk of summarizeParagraphStream) {
    sendChunk(chunk);
  }

  // summarizeParagraphOutput 처리
  (await summarizeParagraphOutput).forEach((summary, paragraphIndex) => {
    lyrics[paragraphIndex].summary = summary ?? "";
  });

  return lyrics;
}
