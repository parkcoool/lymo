import { useQuery } from "@tanstack/react-query";

import { getDominantColorFromElement } from "~/utils/getDominantColorFromElement";

export default function useCoverColor(
  coverElementRef: React.RefObject<HTMLImageElement | null>,
  songId: string
) {
  const { data: coverColor } = useQuery({
    queryKey: ["coverColor", songId],
    queryFn: async () => {
      if (coverElementRef.current == null) throw new Error();
      return await getDominantColorFromElement(coverElementRef.current);
    },
  });

  return coverColor;
}
