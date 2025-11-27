import { StoryPreview, Track, TrackPreview, TrackRequest } from "@lymo/schemas/doc";
import { Language } from "@lymo/schemas/shared";
import { collection, doc, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { experimental_streamedQuery as streamedQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import db from "@/core/firestore";
import { createStreamChannel } from "@/utils/createStreamChannel";

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
        console.log("streamFn started");
        const { push, close, fail, iterator } =
          createStreamChannel<Partial<UseRequestTrackResult>>();

        (async () => {
          try {
            // 요청 문서 생성
            const trackRequestDocRef = doc(
              trackRequestCollectionRef
            ) as FirebaseFirestoreTypes.DocumentReference<TrackRequest>;

            console.log("Creating request doc...", trackRequestDocRef.id);
            // 요청 문서 작성
            await trackRequestDocRef.set(params);
            console.log("Request doc created");

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

              console.log("Listening to track preview at:", trackPreviewDocRef.path);
              unsubscribeTrack.current = trackPreviewDocRef.onSnapshot(
                (snapshot) => {
                  console.log(
                    `Track snapshot event. Path: ${
                      trackPreviewDocRef.path
                    }, Exists: ${snapshot.exists()}`
                  );

                  const data = snapshot.data();
                  if (!data) {
                    console.log("Track snapshot data is empty/undefined");
                    return;
                  }
                  console.log("Track data received, pushing to channel");
                  push({ trackPreview: data });

                  // track은 생성 즉시 완료 처리 (구독 해제)
                  unsubscribeTrack.current?.();
                },
                (err) => {
                  console.error("Track snapshot error:", err);
                  fail(err);
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
                push({ trackPreview: data });
              } else {
                throw new Error("곡을 찾을 수 없습니다.");
              }
            }

            // story preview 관찰
            const storyPreviewDocRef = doc(
              previewCollectionRef,
              "story"
            ) as FirebaseFirestoreTypes.DocumentReference<StoryPreview>;

            console.log("Listening to story preview at:", storyPreviewDocRef.path);
            unsubscribeStory.current = storyPreviewDocRef.onSnapshot(
              (snapshot) => {
                console.log(
                  `Story snapshot event. Path: ${
                    storyPreviewDocRef.path
                  }, Exists: ${snapshot.exists()}`
                );

                const data = snapshot.data();
                if (!data) {
                  console.log("Story snapshot data is empty/undefined");
                  return;
                }
                console.log("Story data received, pushing to channel. Status:", data.status);
                push({ storyPreview: data });

                // status가 COMPLETED이면 완료 처리
                if (data.status === "COMPLETED") close();
              },
              (err) => {
                console.error("Story snapshot error:", err);
                fail(err);
              }
            );
          } catch (error) {
            console.error("Async setup error:", error);
            fail(error as Error);
          }
        })();

        try {
          console.log("Starting iterator");
          yield* iterator();
          console.log("Iterator finished");
        } finally {
          console.log("Cleanup stream");
          unsubscribeTrack.current?.();
          unsubscribeStory.current?.();
        }
      },

      reducer: (acc, chunk) => {
        console.log("Received chunk:", chunk);
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
