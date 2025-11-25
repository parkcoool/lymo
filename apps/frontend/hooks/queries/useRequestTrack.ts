import { TrackRequest } from "@lymo/schemas/doc";
import { Language } from "@lymo/schemas/shared";
import { collection, doc, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import db from "@/core/firestore";

type UseRequestTrackParams =
  | {
      language: Language;
      trackId: string;
    }
  | {
      language: Language;
      title: string;
      artist: string;
      durationInSeconds: number;
    };

interface UseRequestTrackResult {
  storyId: string;
  trackId: string;
}

/**
 * 곡 정보 및 해석 생성을 요청하는 훅입니다.
 * @param params 요청에 필요한 파라미터입니다.
 * @returns 요청 상태를 반환합니다.
 */
export default function useRequestTrack(params: UseRequestTrackParams) {
  const unsubscribe = useRef<() => void>(null);

  useEffect(() => {
    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe.current?.();
  }, [params]);

  return useQuery({
    queryKey: ["request-track", params],

    queryFn: async () => {
      // 요청 문서 생성
      const trackRequestDocRef = doc(
        trackRequestCollectionRef
      ) as FirebaseFirestoreTypes.DocumentReference<TrackRequest>;

      // 요청 문서 작성
      await trackRequestDocRef.set(params);

      const result = await new Promise<UseRequestTrackResult>(
        (resolve, reject) =>
          (unsubscribe.current = trackRequestDocRef.onSnapshot(
            // 요청 문서 감시
            (snap) => {
              const data = snap.data();
              if (data?.storyId && data?.trackId) {
                resolve({ storyId: data.storyId, trackId: data.trackId });
              }
            },

            // 에러 처리
            (error) => reject(error)
          ))
      );

      return result;
    },
  });
}

const trackRequestCollectionRef = collection(
  db,
  "trackRequests"
) as FirebaseFirestoreTypes.CollectionReference<TrackRequest>;
