import { LyricsProvider } from "@lymo/schemas/shared";
import { useSuspenseQuery } from "@tanstack/react-query";

import getLyrics from "@/apis/getLyrics";

interface UseLyricsQueryProps {
  trackId: string;
  lyricsProvider: LyricsProvider;
}

/**
 * @description 사용자가 직접 선택한 곡의 가사를 가져오는 suspenseQuery 훅입니다.
 *
 * @returns suspenseQuery 결과
 */
export default function useLyricsQuery(props: UseLyricsQueryProps) {
  const key = props;

  return useSuspenseQuery({
    queryKey: ["lyrics", key],

    queryFn: async () => {
      console.log("useLyricsQuery called");
      if (!key.trackId) throw new Error("곡 ID가 제공되지 않았습니다.");
      const lyricsDoc = await getLyrics(key);
      return lyricsDoc.lyrics;
    },
  });
}
