import { StoryRequest } from "@lymo/schemas/doc";
import { RetrieveTrackInput } from "@lymo/schemas/functions";
import { Language } from "@lymo/schemas/shared";
import {
  ref,
  push as pushValue,
  onValue,
  Unsubscribe,
  set,
  remove,
} from "@react-native-firebase/database";
import { experimental_streamedQuery as streamedQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import database from "@/core/database";
import { createStreamChannel } from "@/utils/createStreamChannel";

type UseRequestStoryParams = RetrieveTrackInput & { language: Language };

/**
 * 해석 생성을 요청하고 스냅샷을 구독하는 쿼리 훅입니다.
 * @param params 요청 파라미터
 * @returns 요청 상태를 반환합니다.
 */
export default function useRequestStory(params: UseRequestStoryParams) {
  const unsubscribe = useRef<Unsubscribe>(null);

  useEffect(() => {
    return () => unsubscribe.current?.();
  }, []);

  return useQuery({
    queryKey: ["request-story", params],

    queryFn: streamedQuery<StoryRequest, StoryRequest>({
      streamFn: async function* () {
        const { push, close, fail, iterator } = createStreamChannel<StoryRequest>();

        (async () => {
          try {
            // 요청 문서 생성
            const storyRequestRef = pushValue(storyRequestsRef);
            await set(storyRequestRef, { ...params, status: "PENDING" });

            // 기존 구독 해제
            unsubscribe.current?.();

            // 스냅샷 구독 시작
            unsubscribe.current = onValue(
              storyRequestRef,
              async (snapshot) => {
                // TODO: 스키마 검증
                const data = snapshot.val() as StoryRequest;
                push(data);

                // status가 COMPLETED이면 완료 처리
                if (data.status === "COMPLETED") {
                  await remove(storyRequestRef);
                  unsubscribe.current?.();

                  close();
                }
              },
              async (err) => {
                console.error("Error in snapshot listener:", err);
                await remove(storyRequestRef);
                unsubscribe.current?.();

                fail(err);
              }
            );
          } catch (error) {
            if (!(error instanceof Error)) throw error;
            fail(error);
          }
        })();

        try {
          yield* iterator();
        } finally {
          storyRequestsRef.off();
        }
      },

      reducer: (_acc, chunk) => {
        return chunk;
      },

      initialValue: { ...params, status: "PENDING" },
    }),

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

const storyRequestsRef = ref(database, `storyRequests`);
