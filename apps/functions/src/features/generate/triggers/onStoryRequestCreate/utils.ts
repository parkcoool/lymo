import { GeneratedStoryFields, GeneratedStoryFieldsSchema, Story, Track } from "@lymo/schemas/doc";
import { ERROR_CODES } from "@lymo/schemas/error";
import { Language, LyricsProvider } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { Reference } from "firebase-admin/database";
import { DocumentReference } from "firebase-admin/firestore";

const MIN_DELAY_BETWEEN_WRITES = 500;

interface StoryUpdaterParams {
  track: Track;
  trackId: string;
  requestId: string;
  config: {
    language: Language;
    lyricsProvider: LyricsProvider;
  };
}

/**
 * `stories` 해석 문서와 `storyRequests/{requestId}` 데이터베이스를 업데이트하는 유틸리티 클래스
 */
export class StoryUpdater {
  track: Track;
  trackId: string;
  language: Language;
  lyricsProvider: LyricsProvider;

  // story 본 문서
  storyDocRef: DocumentReference<Story>;
  // storyRequests/{requestId} 문서
  storyRequestDocRef: Reference;

  lastWrittenAt: number = 0;
  pendingData: Partial<GeneratedStoryFields> = {};

  constructor({
    track,
    trackId,
    requestId,
    config: { language, lyricsProvider },
  }: StoryUpdaterParams) {
    // 필드 초기화
    this.track = track;
    this.trackId = trackId;
    this.language = language;
    this.lyricsProvider = lyricsProvider;

    // 문서 참조 생성
    this.storyDocRef = admin.firestore().collection("stories").doc() as DocumentReference<Story>;
    this.storyRequestDocRef = admin.database().ref(`storyRequests/${requestId}`);

    // story preview 문서 초기화
    this.storyRequestDocRef.set({
      ...this.baseFields,
      status: "IN_PROGRESS",
    });
  }

  /**
   * 스로틀링이 적용된 업데이트 메서드
   * @param data 업데이트할 데이터
   * @returns 업데이트가 실제로 수행되었는지 여부
   */
  async update(data: Partial<GeneratedStoryFields>) {
    // 업데이트할 데이터를 누적
    this.pendingData = { ...this.pendingData, ...data };

    // 가장 마지막에 업데이트한 지 일정 시간이 지났을 때에만 업데이트 수행
    const nowTimestamp = Date.now();
    if (nowTimestamp - this.lastWrittenAt < MIN_DELAY_BETWEEN_WRITES) return false;

    // story preview 문서 업데이트 수행
    const now = new Date().toISOString();
    await this.storyRequestDocRef.update({
      ...this.pendingData,
      updatedAt: now,
      status: "IN_PROGRESS",
    });

    // 마지막 업데이트 시간 갱신
    this.lastWrittenAt = nowTimestamp;

    return true;
  }

  /**
   * 완료 처리 메서드
   *
   * `data`가 제공되지 않은 경우, 마지막으로 스로틀링된 데이터를 사용하여 완료 처리합니다.
   * @param data 완료 처리할 데이터 (선택 사항)
   * @returns 완료 처리된 문서
   */
  async complete(data?: GeneratedStoryFields) {
    const now = new Date().toISOString();
    const finalData = data ?? this.pendingData;

    try {
      // finalData가 완성형인지 확인
      const parsedFinalData = GeneratedStoryFieldsSchema.parse(finalData);

      await Promise.all([
        // preview 문서 업데이트
        this.storyRequestDocRef.update({
          ...parsedFinalData,
          status: "COMPLETED",
          updatedAt: now,
        }),

        // 본 문서 업데이트
        this.storyDocRef.set({ ...this.baseFields, ...parsedFinalData, updatedAt: now }),
      ]);
    } catch (error) {
      // 검증 실패 시 story preview 문서의 상태를 FAILED로 업데이트
      await this.storyRequestDocRef.set({
        status: "FAILED",
        errorCode: ERROR_CODES.STORY_SAVE_FAILED,
      });

      throw error;
    }
  }

  /**
   * story 및 story preview 문서에 공통으로 들어가는 필드들
   */
  private get baseFields() {
    const now = new Date().toISOString();

    return {
      trackId: this.trackId,
      trackTitle: this.track.title,
      trackArtists: this.track.artists,
      trackAlbum: this.track.album,
      trackAlbumArt: this.track.albumArt,
      userId: "bot",
      userName: "__BOT__",
      userAvatar: null,

      language: this.language,
      lyricsProvider: this.lyricsProvider,

      stats: { favoriteCount: 0, viewCount: 0 },
      updatedAt: now,
    };
  }
}
