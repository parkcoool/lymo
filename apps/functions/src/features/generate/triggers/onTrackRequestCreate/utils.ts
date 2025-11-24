import { GeneratedStoryFields, Story } from "@lymo/schemas/doc";
import admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";

const MIN_DELAY_BETWEEN_WRITES = 500;

/**
 * 스로틀링이 적용된 해석 문서 업데이트 클래스
 */
export class StoryUpdater {
  docRef: admin.firestore.DocumentReference<Story>;
  lastWrittenAt: number = 0;
  pendingData: Partial<GeneratedStoryFields> = {};

  constructor(storyId: string) {
    this.docRef = admin.firestore().collection("stories").doc(storyId) as DocumentReference<Story>;
  }

  /**
   * 스로틀링이 적용된 업데이트 메서드
   * @param data 업데이트할 데이터
   * @returns 업데이트가 실제로 수행되었는지 여부
   */
  async update(data: Partial<GeneratedStoryFields>) {
    this.pendingData = { ...this.pendingData, ...data };
    const now = Date.now();

    // 가장 마지막에 업데이트한 지 일정 시간이 지났을 때에만 업데이트 수행
    if (now - this.lastWrittenAt < MIN_DELAY_BETWEEN_WRITES) return false;

    // 업데이트 수행
    await this.docRef.update({
      ...this.pendingData,
      updatedAt: now.toString(),
      status: "IN_PROGRESS",
    });
    this.lastWrittenAt = now;
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
    const now = Date.now();

    if (data) {
      return await this.docRef.update({
        ...data,
        updatedAt: now.toString(),
        status: "COMPLETED",
      });
    } else {
      return await this.docRef.update({
        ...this.pendingData,
        updatedAt: now.toString(),
        status: "COMPLETED",
      });
    }
  }
}
