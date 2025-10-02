import { useQuery } from "@tanstack/react-query";
import { getColors } from "react-native-image-colors";

export default function useCoverColor(coverUrl: string | null) {
  const { data: coverColor } = useQuery({
    queryKey: ["cover-color", coverUrl],
    queryFn: async () => {
      if (coverUrl == null) {
        return null;
      } else {
        const colors = await getColors(coverUrl);
        if (colors.platform === "ios") {
          return colors.background;
        } else {
          return colors.dominant;
        }
      }
    },
    enabled: coverUrl != null,
  });

  return coverColor;
}
