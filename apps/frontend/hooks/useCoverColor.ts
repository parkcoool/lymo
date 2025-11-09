import { useQuery } from "@tanstack/react-query";
import { getColors } from "react-native-image-colors";

export default function useCoverColor(coverUrl: string | null) {
  const { data: coverColor } = useQuery({
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
    placeholderData: "#000000",
    enabled: coverUrl != null,
    staleTime: Infinity,
  });

  return coverColor;
}
