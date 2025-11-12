import {
  AddTrackFlowInputSchema,
  AddTrackFlowStreamSchema,
  AddTrackFlowOutputSchema,
} from "@lymo/schemas/function";

import ai from "@/core/genkit";
import checkDuplication from "@/helpers/addTrack/checkDuplication";
import getLyricsFromLRCLIB from "@/helpers/addTrack/getLyricsFromLRCLIB";
import processLyrics from "@/helpers/addTrack/processLyrics";
import saveTrackToFirestore from "@/helpers/addTrack/saveTrackToFirestore";
import sendInitialChunks from "@/helpers/addTrack/sendInitialChunks";
import summarizeSong from "@/helpers/addTrack/summarizeSong";
import { searchSpotify } from "@/tools/searchSpotify";

/**
 * 음악 제목과 아티스트명을 입력받아 정확한 메타데이터와 가사를 포함한 음악 정보를 스트리밍하고 DB에 등록하는 플로우
 */
export const addTrackFlow = ai.defineFlow(
  {
    name: "addTrackFlow",
    inputSchema: AddTrackFlowInputSchema,
    streamSchema: AddTrackFlowStreamSchema,
    outputSchema: AddTrackFlowOutputSchema,
  },
  async (input, { sendChunk }) => {
    // 0. title과 arist가 둘 다 빈 문자열인 경우
    if (input.title.trim() === "" && input.artist.trim() === "") {
      return { notFound: true };
    }

    // 1. Spotify에서 곡 검색
    const spotifyResult = await searchSpotify({
      title: input.title,
      artist: input.artist,
      duration: input.duration,
    });
    if (spotifyResult === null) return { notFound: true };

    // 2. LRCLIB에서 곡 검색
    const lrclibResult = await getLyricsFromLRCLIB(
      spotifyResult.title,
      spotifyResult.artist,
      spotifyResult.duration
    );
    if (!lrclibResult) return { notFound: true };

    // 3. 중복 확인
    const duplicatedId = await checkDuplication(spotifyResult.id);
    if (duplicatedId) return { duplicate: true, id: duplicatedId };

    // 4. 메타데이터 및 가사 전송
    sendInitialChunks(sendChunk, spotifyResult, lrclibResult);

    // 5. 가사 그룹화, 번역, 문단 요약 및 곡 요약 병렬 처리
    const [lyrics, summary] = await Promise.all([
      // 가사 그룹화, 번역, 문단 요약
      processLyrics(sendChunk, spotifyResult, lrclibResult),

      // 곡 요약
      summarizeSong(sendChunk, spotifyResult, lrclibResult),
    ]);

    // 6. Firestore에 음악 메타데이터 및 가사 등록
    await saveTrackToFirestore(spotifyResult, summary, lyrics);

    // 7. 완료 전송
    sendChunk({ event: "complete", data: null });

    // 8. 결과 반환
    return {
      duplicate: false,
      id: spotifyResult.id,
    };
  }
);
