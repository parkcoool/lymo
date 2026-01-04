import * as Crypto from "expo-crypto";
import { useEffect, useRef, useState } from "react";

import useActiveBucketIndex from "./useActiveBucket";
import useReactionBucketsQuery from "./useReactionBucketsQuery";

const MAX_EMOJIS_ON_SCREEN = 50;

interface UseEmojiQueueProps {
  storyId: string;
}

export interface EmojiItem {
  id: string;
  emoji: string;
}

export default function useEmojiQueue({ storyId }: UseEmojiQueueProps) {
  const { data: buckets } = useReactionBucketsQuery({ storyId });
  const activeBucketIndex = useActiveBucketIndex();

  const [queue, setQueue] = useState<EmojiItem[]>([]);

  // 현재 버킷에서 이미 스케줄링된 이모지 개수를 추적
  const shownCountsRef = useRef<Record<string, number>>({});
  // 버킷 변경 감지용
  const lastBucketIndexRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (activeBucketIndex === undefined || !buckets) return;

    const currentBucket = buckets[activeBucketIndex];
    const counts = currentBucket?.counts || {};

    // 1. 버킷이 변경되었는지 확인
    const isNewBucket = activeBucketIndex !== lastBucketIndexRef.current;
    if (isNewBucket) {
      shownCountsRef.current = {}; // 새 버킷이면 카운트 초기화
      lastBucketIndexRef.current = activeBucketIndex;
    }

    // 2. 스케일링 계산
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const scale = totalCount > MAX_EMOJIS_ON_SCREEN ? MAX_EMOJIS_ON_SCREEN / totalCount : 1;

    // 3. 새로 추가해야 할 이모지(Delta) 계산
    const emojisToSpawn: string[] = [];

    Object.entries(counts).forEach(([emoji, count]) => {
      const targetCount = Math.floor(count * scale);
      const shownCount = shownCountsRef.current[emoji] || 0;
      const delta = targetCount - shownCount;

      if (delta > 0) {
        // 추가해야 할 개수만큼 배열에 담음
        for (let i = 0; i < delta; i++) {
          emojisToSpawn.push(emoji);
        }
        // 보여준 개수 업데이트
        shownCountsRef.current[emoji] = targetCount;
      }
    });

    if (emojisToSpawn.length === 0) return;

    // 4. 스케줄링 (새 버킷이면 5초 동안 분산, 업데이트면 즉시)
    // 새 버킷 진입 시: 5000ms 동안 분산
    // 같은 버킷 내 업데이트(사용자 반응 등): 500ms 내에 빠르게 등장 (즉각적 피드백)
    const distributionDuration = isNewBucket ? 5000 : 500;

    emojisToSpawn.forEach((emoji) => {
      // 랜덤 딜레이 적용
      const delay = Math.random() * distributionDuration;

      setTimeout(() => {
        setQueue((prev) => {
          const newQueue = [...prev];
          newQueue.push({ id: Crypto.randomUUID(), emoji });
          return newQueue;
        });

        // 5초 후 큐에서 제거 (메모리 관리)
        setTimeout(() => {
          setQueue((prev) => {
            const newQueue = [...prev];
            newQueue.shift(); // 앞에서부터 제거 (FIFO)
            return newQueue;
          });
        }, 5000);
      }, delay);
    });
  }, [activeBucketIndex, buckets]);

  return queue;
}
