import { Track, TrackRequestSchema } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { logger } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";

import CommonError from "@/features/shared/errors/CommonError";
import { searchSpotify } from "@/features/shared/tools/searchSpotify";

import getLyricsFromLRCLIB from "../../helpers/getLyricsFromLRCLIB";
import { createTrackDoc } from "../../tools/createTrackDoc";
import { getTrackDoc } from "../../tools/getTrackDoc";

import { ensureDefaultStory } from "./helpers";

export const onTrackRequestCreate = onDocumentCreated("requests/{requestId}", async (event) => {
  const request = event.data?.data();
  if (!request) return;

  const input = TrackRequestSchema.parse(request);

  try {
    // trackId를 전달한 경우
    if ("trackId" in input) {
      const { trackId, language } = input;

      // 1) DB에서 track 문서 가져오기
      const track = await getTrackDoc({ trackId });
      if (!track) throw new Error(ERROR_CODES.TRACK_NOT_FOUND);

      // 2) 곡 해석 생성 및 저장
      await ensureDefaultStory({ track, trackId, language });
    }

    // title, artist, durationInSeconds를 전달한 경우
    else {
      const { language, title, artist, durationInSeconds } = input;

      // 1) Spotify에서 트랙 검색
      const spotifyResult = await searchSpotify({
        title,
        artist,
        durationInSeconds,
      });
      if (!spotifyResult) throw new Error(ERROR_CODES.EXTERNAL_TRACK_NOT_FOUND);
      const trackId = spotifyResult.id;

      // 2) LRCLIB에서 가사 검색
      const lrclibResult = await getLyricsFromLRCLIB({
        title: spotifyResult.title,
        artists: spotifyResult.artists,
        duration: spotifyResult.durationInSeconds,
      });
      if (!lrclibResult) throw new Error(ERROR_CODES.LYRICS_NOT_FOUND);

      // 3) track 문서 데이터 준비
      const now = new Date().toISOString();
      const track: Track = {
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

      // 4) track 문서 생성
      await createTrackDoc({ trackDoc: track, id: trackId });

      // 5) 곡 해석 생성 및 저장
      await ensureDefaultStory({ track, trackId, language });
    }
  } catch (error) {
    if (error instanceof CommonError) {
      logger.error(`An error occurred in \`onTrackRequestCreate\`: ${error.code}`, error);
      return;
    }

    logger.error(`An unexpected error occurred in \`onTrackRequestCreate\``, error);
  } finally {
    // 요청 문서 삭제
    await event.data?.ref.delete();
  }
});
