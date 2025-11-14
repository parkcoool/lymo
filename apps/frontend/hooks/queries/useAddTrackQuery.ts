import { useSuspenseQuery } from "@tanstack/react-query";

import addTrack from "@/apis/addTrack";

interface UseAddTrackProps {
  title: string;
  artist: string;
  duration: number;
}

/**
 * @description 기기에서 재생 중인 미디어로 곡 정보를 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useAddTrackQuery(props: UseAddTrackProps) {
  const key = props;

  return useSuspenseQuery({
    queryKey: ["track", "stream", key],

    queryFn: async () => {
      const result = await addTrack(key);
      if (result.notFound) throw new Error("곡을 찾을 수 없습니다.");
      const { notFound, ...data } = result;
      return data;
    },
  });
}
