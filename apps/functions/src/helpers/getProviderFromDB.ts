import type { ProviderDoc } from "@lymo/schemas/doc";
import { LLMModel } from "@lymo/schemas/shared";
import admin from "firebase-admin";
import { CollectionReference } from "firebase-admin/firestore";

interface GetProviderFromDBParams {
  trackId: string;
  model?: LLMModel;
}

/**
 * @description 특정 trackId와 LLM 모델에 해당하는 제공자 문서와 그 ID를 우선 순위에 따라 DB에서 가져옵니다.
 * @param trackId 가져올 곡의 ID
 * @param model LLM 모델 (선택 사항)
 * @returns Provider 문서 데이터와 ID 또는 null (존재하지 않는 경우)
 */
export default async function getProviderFromDB({ trackId, model }: GetProviderFromDBParams) {
  const providersCollectionRef = admin
    .firestore()
    .collection("tracks")
    .doc(trackId)
    .collection("details") as CollectionReference<ProviderDoc>;

  // 모델이 지정된 경우 해당 모델에 맞는 제공자 문서 우선 검색
  if (model) {
    const modelProviderDocSnap = await providersCollectionRef.doc(model).get();
    const modelProviderDoc = modelProviderDocSnap.data();
    if (modelProviderDocSnap.exists && modelProviderDoc) {
      return { provider: modelProviderDoc, id: modelProviderDocSnap.id };
    }
  }

  // TODO: 추후에 '좋아요' 기능 추가 시 반영
  // 우선 순위에 따라 제공자 문서 검색 (생성일 기준 오름차순)
  const providerDocSnaps = await providersCollectionRef.orderBy("createdAt", "asc").limit(1).get();

  if (providerDocSnaps.empty) return null;
  const providerDocSnap = providerDocSnaps.docs[0];
  const providerDoc = providerDocSnap.data();
  if (!providerDoc) return null;
  return { provider: providerDoc, id: providerDocSnap.id };
}
