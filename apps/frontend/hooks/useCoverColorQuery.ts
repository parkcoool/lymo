import { useSuspenseQuery } from "@tanstack/react-query";
import { getColors } from "react-native-image-colors";

/**
 * @description 앨범 커버 이미지의 주요 색상을 가져오는 훅입니다.
 * @param coverUrl 앨범 커버 이미지 URL
 * @returns 앨범 커버 이미지의 주요 색상 문자열 (예: "#RRGGBB")
 */
export default function useCoverColorQuery(coverUrl: string | null) {
  return useSuspenseQuery({
    queryKey: ["cover-color", coverUrl],
    queryFn: async () => {
      if (coverUrl == null) {
        return "#000000";
      } else {
        const results = await getColors(coverUrl);

        if (results.platform === "ios") {
          return results.background;
        } else {
          return results.dominant;
        }
      }
    },
    staleTime: Infinity,
  });
}
