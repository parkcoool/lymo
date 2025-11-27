import { TrackRequestSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";

import CommonError from "@/features/shared/errors/CommonError";
import { searchSpotify } from "@/features/shared/tools/searchSpotify";

import getLyricsFromLRCLIB from "../../helpers/getLyricsFromLRCLIB";
import { createTrackDoc } from "../../tools/createTrackDoc";
import { getTrackDoc } from "../../tools/getTrackDoc";

import { ensureDefaultStory } from "./helpers";

export const onTrackRequestCreate = onDocumentCreated(
  "trackRequests/{requestId}",
  async (event) => {
    if (!event.data) return;

    const requestId = event.data.id;
    const request = event.data.data();
    const input = TrackRequestSchema.parse(request);

    try {
      // title, artist, durationInSeconds를 전달한 경우
      if ("title" in input && "artist" in input && "durationInSeconds" in input) {
        const { language, title, artist, durationInSeconds } = input;

        // 1) Spotify에서 트랙 검색
        const spotifyResult = await searchSpotify({
          title,
          artist,
          durationInSeconds,
        });
        if (!spotifyResult) throw new Error(ERROR_CODES.EXTERNAL_TRACK_NOT_FOUND);
        const trackId = spotifyResult.id;

        // 2) track 문서가 이미 존재하는지 확인
        let track = await getTrackDoc({ trackId });

        // 3) track 문서가 존재하지 않는 경우 생성
        if (!track) {
          // 3-1) LRCLIB에서 가사 검색
          const lrclibResult = await getLyricsFromLRCLIB({
            title: spotifyResult.title,
            artists: spotifyResult.artists,
            duration: spotifyResult.durationInSeconds,
          });
          if (!lrclibResult) throw new Error(ERROR_CODES.LYRICS_NOT_FOUND);

          // 3-2) track 문서 데이터 준비
          const now = new Date().toISOString();
          track = {
            title: spotifyResult.title,
            artists: spotifyResult.artists,
            album: spotifyResult.album,
            albumArt: spotifyResult.albumArt,
            durationInSeconds: spotifyResult.durationInSeconds,
            publishedAt: spotifyResult.publishedAt,
            lyrics: { lrclib: lrclibResult.lyrics },

            createdAt: now,
            stats: { storyCount: 0, viewCount: 0 },
          };

          // 3-3) tracks 컬렉션과 trackRequest의 서브컬렉션 모두에 track 문서 생성
          await createTrackDoc({ track, trackId, requestId });
        }

        // 4) track 문서가 이미 존재하는 경우
        else {
          // 4-1) trackRequest의 서브컬렉션에만 track 문서 생성
          await createTrackDoc({ track, requestId });
        }

        // 5) 곡 해석 생성 및 저장
        await ensureDefaultStory({ track, trackId, requestId, language });
      }

      // trackId를 전달한 경우
      else {
        const { trackId, language } = input;

        // 1) DB에서 track 문서 가져오기
        const track = await getTrackDoc({ trackId });
        if (!track) throw new Error(ERROR_CODES.TRACK_NOT_FOUND);

        // 2) trackRequest의 서브컬렉션에만 track 문서 생성
        await createTrackDoc({ track, requestId });

        // 3) 곡 해석 생성 및 저장
        await ensureDefaultStory({ track, trackId, requestId, language });
      }
    } catch (error) {
      if (error instanceof CommonError) {
        logger.error(`An error occurred in \`onTrackRequestCreate\`: ${error.code}`, error);
        return;
      }

      logger.error(`An unexpected error occurred in \`onTrackRequestCreate\``, error);
    }
  }
);
