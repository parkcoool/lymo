import { useQuery } from "@tanstack/react-query";
import { getColors } from "react-native-image-colors";

import { colors } from "@/shared/constants/colors";

/**
 * 이미지의 주요 색상을 가져오는 query 훅입니다.
 * @param src 이미지 URL
 * @returns query 결과
 */
export default function useDominantColorQuery(
  src?: string | null,
  placeholderColor = colors.background
) {
  return useQuery({
    queryKey: ["cover-color", src],
    queryFn: async () => {
      if (src == null || src === "") {
        return placeholderColor;
      }

      try {
        const results = await getColors(src);

        if (results.platform === "ios") {
          return results.background;
        } else {
          return results.dominant;
        }
      } catch (error) {
        console.error("[COVER_COLOR_ERROR]", {
          albumArt: src,
          error: error instanceof Error ? error.message : String(error),
        });
        // 이미지 로딩 실패 시 기본 색상 반환
        return placeholderColor;
      }
    },
    enabled: !!src,
    staleTime: Infinity,
    placeholderData: placeholderColor,
  });
}
