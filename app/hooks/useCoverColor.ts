import { useQuery } from "@tanstack/react-query";

import { getDominantColorFromElement } from "~/utils/getDominantColorFromElement";

export default function useCoverColor(
  coverElementRef: React.RefObject<HTMLImageElement | null>,
  coverUrl: string | null
) {
  const { data: coverColor } = useQuery({
    queryKey: ["coverColor", coverUrl],
    queryFn: async () => {
      if (coverElementRef.current == null) throw new Error();
      return await getDominantColorFromElement(coverElementRef.current);
    },
    enabled: coverUrl != null,
  });

  return coverColor;
}
