import { StoryPreview, Track, TrackPreview, TrackRequest } from "@lymo/schemas/doc";
import { Language } from "@lymo/schemas/shared";
import { collection, doc, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { experimental_streamedQuery as streamedQuery, useQuery } from "@tanstack/react-query";
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
  trackPreview?: TrackPreview;
  storyPreview: StoryPreview;
}

/**
 * 곡 정보 및 해석 생성을 요청하고 스냅샷을 구독하는 훅입니다.
 * @param params 요청에 필요한 파라미터입니다.
 * @returns 요청 상태를 반환합니다.
 */
export default function useRequestTrack(params: UseRequestTrackParams) {
  const unsubscribeTrack = useRef<() => void>(null);
  const unsubscribeStory = useRef<() => void>(null);

  useEffect(() => {
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribeTrack.current?.();
      unsubscribeStory.current?.();
    };
  }, [params]);

  return useQuery({
    queryKey: ["request-track", params],

    queryFn: streamedQuery<Partial<UseRequestTrackResult>, UseRequestTrackResult>({
      streamFn: async function* () {
        // 이벤트를 전달할 채널 생성
        const channel: Partial<UseRequestTrackResult>[] = [];
        let resolveNext: ((value: IteratorResult<Partial<UseRequestTrackResult>>) => void) | null =
          null;
        let error: Error | null = null;
        let isCompleted = false;

        // 데이터를 채널에 푸시하는 함수
        const push = (data: Partial<UseRequestTrackResult>) => {
          if (resolveNext) {
            resolveNext({ value: data, done: false });
            resolveNext = null;
          } else {
            channel.push(data);
          }
        };

        // 완료 처리 함수
        const complete = () => {
          isCompleted = true;
          unsubscribeTrack.current?.();
          unsubscribeStory.current?.();
          if (resolveNext) {
            resolveNext({ value: undefined, done: true });
            resolveNext = null;
          }
        };

        // 요청 문서 생성
        const trackRequestDocRef = doc(
          trackRequestCollectionRef
        ) as FirebaseFirestoreTypes.DocumentReference<TrackRequest>;

        // 요청 문서 작성
        await trackRequestDocRef.set(params);

        // previews 컬렉션 참조
        const previewCollectionRef = collection(
          trackRequestDocRef,
          "previews"
        ) as FirebaseFirestoreTypes.CollectionReference;

        // trackId가 없는 경우 track preview 관찰
        if (!("trackId" in params)) {
          const trackPreviewDocRef = doc(
            previewCollectionRef,
            "track"
          ) as FirebaseFirestoreTypes.DocumentReference<TrackPreview>;

          unsubscribeTrack.current = trackPreviewDocRef.onSnapshot(
            (snapshot) => {
              const data = snapshot.data();
              if (!data) return;
              push({ trackPreview: data });

              // track은 생성 즉시 완료 처리
              unsubscribeTrack.current?.();
            },
            (err) => {
              error = err;
              if (resolveNext) {
                resolveNext({ value: undefined, done: true });
                resolveNext = null;
              }
            }
          );
        }

        // trackId가 있는 경우 이미 있는 track 문서 가져오기
        else {
          const trackDocRef = doc(
            trackCollectionRef,
            params.trackId
          ) as FirebaseFirestoreTypes.DocumentReference<Track>;
          const snapshot = await trackDocRef.get();
          const data = snapshot.data();
          if (data) {
            yield { trackPreview: data };
          } else {
            throw new Error("곡을 찾을 수 없습니다.");
          }
        }

        // story preview 관찰
        const storyPreviewDocRef = doc(
          previewCollectionRef,
          "story"
        ) as FirebaseFirestoreTypes.DocumentReference<StoryPreview>;

        unsubscribeStory.current = storyPreviewDocRef.onSnapshot(
          (snapshot) => {
            const data = snapshot.data();
            if (!data) return;
            push({ storyPreview: data });

            // status가 COMPLETED이면 완료 처리
            if (data.status === "COMPLETED") complete();
          },
          (err) => {
            error = err;
            if (resolveNext) {
              resolveNext({ value: undefined, done: true });
              resolveNext = null;
            }
          }
        );

        // 채널에서 데이터를 yield
        while (!isCompleted) {
          if (error) throw error;

          if (channel.length > 0) {
            yield channel.shift()!;
          } else {
            const result = await new Promise<IteratorResult<Partial<UseRequestTrackResult>>>(
              (resolve) => {
                resolveNext = resolve;
              }
            );
            if (result.done) break;
          }
        }
      },

      reducer: (acc, chunk) => {
        return {
          trackPreview: chunk.trackPreview ?? acc.trackPreview,
          storyPreview: chunk.storyPreview ?? acc.storyPreview,
        };
      },

      initialValue: {
        trackPreview: undefined,
        storyPreview: { status: "PENDING" },
      },
    }),

    initialData: {
      trackPreview: undefined,
      storyPreview: { status: "PENDING" },
    },
  });
}

const trackRequestCollectionRef = collection(
  db,
  "trackRequests"
) as FirebaseFirestoreTypes.CollectionReference<TrackRequest>;

const trackCollectionRef = collection(
  db,
  "tracks"
) as FirebaseFirestoreTypes.CollectionReference<Track>;
