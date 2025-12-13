import { BaseStoryFields, GeneratedStoryFields } from "@lymo/schemas/doc";
import { RetrieveTrackInput } from "@lymo/schemas/functions";
import { StoryRequest, StoryRequestSchema } from "@lymo/schemas/rtdb";
import { Language } from "@lymo/schemas/shared";
import { ref, push as pushValue, onValue, Unsubscribe, set } from "@react-native-firebase/database";
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

    queryFn: streamedQuery<
      StoryRequest,
      (BaseStoryFields & Partial<GeneratedStoryFields>) | undefined
    >({
      streamFn: async function* () {
        // 1) 요청 문서 생성
        const storyRequestRef = pushValue(storyRequestsRef);
        await set(storyRequestRef, { ...params, status: "PENDING" });

        // 2) 스트림 채널 생성
        const streamChannel = createStreamChannel<StoryRequest>();

        // 3) 기존 구독 해제 및 새 구독 시작
        unsubscribe.current?.();
        unsubscribe.current = onValue(
          storyRequestRef,

          // 3-1) 스냅샷 업데이트 처리
          async (snapshot) => {
            const storyRequest = StoryRequestSchema.safeParse(snapshot.val());

            if (!storyRequest.success) {
              streamChannel.fail(new Error("해석 요청 데이터가 올바르지 않습니다."));
              return;
            }

            streamChannel.push(storyRequest.data);

            // 생성이 완료된 경우
            if (storyRequest.data.status === "COMPLETED") {
              unsubscribe.current?.();
              streamChannel.close();
            }
          },

          // 3-2) 에러 처리
          async (err) => streamChannel.fail(err)
        );

        yield* streamChannel.iterator();
        unsubscribe.current?.();
      },

      reducer: (_acc, chunk) => {
        if (chunk === undefined) return chunk;
        if (chunk.status === "IN_PROGRESS" || chunk.status === "COMPLETED") {
          // 1) userAvatar 변환
          // string | null | undefined -> string | null 타입으로 변환
          const userAvatar = chunk.userAvatar ?? null;

          // 2) sectionNotes 변환
          // Record<number, string> | (string | null)[] -> (string | null)[]
          const sectionNotes = convertToNullableArray(chunk.sectionNotes);

          // 3) lyricTranslations 변환
          // Record<number, string> | (string | null)[] -> (string | null)[]
          const lyricTranslations = convertToNullableArray(chunk.lyricTranslations);

          return { ...chunk, userAvatar, sectionNotes, lyricTranslations };
        }
        return undefined;
      },

      initialValue: undefined,
    }),

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

const storyRequestsRef = ref(database, `storyRequests`);

/**
 * `Record<number, string>` 또는 `(string | null)[]` 형태의 데이터를 `(string | null)[]` 배열로 변환합니다.
 */
function convertToNullableArray(
  data: Record<number, string> | (string | null)[] | undefined
): (string | null)[] {
  if (!data) return [];

  if (Array.isArray(data)) {
    return [...data];
  }

  const maxIndex = Math.max(...Object.keys(data).map((k) => Number(k)));
  const result: (string | null)[] = [];
  for (let i = 0; i <= maxIndex; i++) {
    result.push(data[i] ?? null);
  }
  return result;
}
