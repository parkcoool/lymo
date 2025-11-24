import { TrackDoc } from "@lymo/schemas/doc";
import { GetTrackFromIdFlowOutput, GetTrackFromIdFlowStream } from "@lymo/schemas/function";
import { Language, LLMModel } from "@lymo/schemas/shared";

import getLyricsFromDB from "@/features/generate/helpers/getLyricsFromDB";
import getProviderFromDB from "@/features/generate/helpers/getProviderFromDB";
import getTrackDetailFromDB from "@/features/generate/helpers/getTrackDetailFromDB";
import { streamLyricsAndTrackDetail } from "@/features/generate/helpers/streamLyricsAndTrackDetail";

interface GetTrackFromTrackParams {
  track: {
    trackDoc: TrackDoc;
    trackId: string;
  };
  config: {
    language: Language;
    model: LLMModel;
  };
}

/**
 * @description track 문서 정보를 받아 관련 정보를 가져오거나 생성하여 DB에 저장한 뒤 반환하는 헬퍼 함수
 */
export default async function* getTrackFromTrack({
  track: { trackDoc, trackId },
  config: { language, model },
}: GetTrackFromTrackParams): AsyncGenerator<GetTrackFromIdFlowStream, GetTrackFromIdFlowOutput> {
  // 1) provider 문서 가져오기
  const providerDoc = await getProviderFromDB({ trackId, model });

  // 1-1) provider 문서가 존재하지 않는 경우 lyrics 및 trackDetail 스트리밍 시작
  if (!providerDoc) {
    const stream = streamLyricsAndTrackDetail({
      track: {
        trackId,
        title: trackDoc.title,
        album: trackDoc.album,
        artists: trackDoc.artists,
        duration: trackDoc.duration,
      },
      config: { language, model },
    });

    for await (const chunk of stream) yield chunk;
    return { success: true };
  }

  // 1-2) provider 문서 스트리밍
  yield {
    event: "update_provider",
    data: providerDoc,
  };

  // 2) trackDetail 문서 가져오기
  const trackDetailDoc = await getTrackDetailFromDB({
    trackId,
    language,
    providerId: providerDoc.providerId,
  });

  // 2-1) trackDetail 문서가 존재하지 않는 경우 lyrics 및 trackDetail 스트리밍 시작
  if (!trackDetailDoc) {
    const stream = streamLyricsAndTrackDetail({
      track: {
        trackId,
        title: trackDoc.title,
        album: trackDoc.album,
        artists: trackDoc.artists,
        duration: trackDoc.duration,
      },
      config: { language, model },
    });

    for await (const chunk of stream) yield chunk;
    return { success: true };
  }

  // 2-2) trackDetail 문서 스트리밍
  yield {
    event: "update_track_detail",
    data: trackDetailDoc,
  };

  // 3) lyrics 문서 가져오기
  const lyricsDoc = await getLyricsFromDB({
    trackId,
    lyricsProvider: trackDetailDoc.lyricsProvider,
  });

  // 3-1) lyrics 문서가 존재하지 않는 경우 error 반환
  if (!lyricsDoc) return { success: false, message: "가사 정보를 찾을 수 없습니다." };
  // 3-2) lyrics 문서 스트리밍
  yield {
    event: "update_lyrics",
    data: lyricsDoc,
  };

  return { success: true };
}
